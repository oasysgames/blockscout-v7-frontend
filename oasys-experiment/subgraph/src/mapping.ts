import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  ETHDepositInitiated,
  ETHWithdrawalFinalized
} from "../generated/ChainVerseBridge/BridgeABI"
import { BridgeEvent, DailyBridgeStat, VerseInfo, VerseLatestAccumulatedAmount } from "../generated/schema"

// Chain name mapping
const VERSE_NAMES = new Map<string, string>()
VERSE_NAMES.set("0x24d133Df1d72089809945EC9550f72f8415AC780".toLowerCase(), "ChainVerse")
VERSE_NAMES.set("0x0cc5366BE800cf73daB2DBfDE031C255a6f1E3cC".toLowerCase(), "DefiVerse")
VERSE_NAMES.set("0x62Ec33Ea441d654008d5E631D11B6A3cb7034e31".toLowerCase(), "GeekVerse")
VERSE_NAMES.set("0x9F740B3E8E823E68294eEA69299908E3FdEe1Ea7".toLowerCase(), "GesoVerse")
VERSE_NAMES.set("0x9245e19eB88de2534E03E764FB2a5f194e6d97AD".toLowerCase(), "HOMEVerse")
VERSE_NAMES.set("0xA16517A9796bAc73eFA7d07269F9818b7978dc2A".toLowerCase(), "MCHVerse")
VERSE_NAMES.set("0x4FfA6d5745C2E78361ae91a36312524284F3D812".toLowerCase(), "SaakuruVerse")
VERSE_NAMES.set("0xa34a85ecb19c88d4965EcAfB10019E63050a1098".toLowerCase(), "TCGVerse")
VERSE_NAMES.set("0x80d7aAB75B4144AF77E04C1A334e7236Be4771d0".toLowerCase(), "XPLAVerse")
VERSE_NAMES.set("0xf6944626a2EA29615e05f3AC9Ab2568e8E004e9D".toLowerCase(), "YooldoVerse")

function getChainName(address: string): string {
  let chainName = VERSE_NAMES.get(address.toLowerCase())
  return chainName || "Unknown"
}

function getVerseInfo(verseId: string): VerseInfo {
  let verseInfo = VerseInfo.load(verseId)
  if (!verseInfo) {
    verseInfo = new VerseInfo(verseId)
    verseInfo.verseName = verseId
    verseInfo.verseChain = ""
    verseInfo.verseRpc = ""
    verseInfo.bridgeAddress = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
    verseInfo.isActive = true
    verseInfo.lastUpdated = BigInt.fromI32(0)
    verseInfo.save()
  }
  return verseInfo
}

function getDayId(timestamp: BigInt): string {

  let unixTime = timestamp.toString()
  let timestampMs = BigInt.fromString(unixTime).times(BigInt.fromI32(1000))
  let date = new Date(timestampMs.toI64())
  
  let year = date.getUTCFullYear()
  let month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  let day = date.getUTCDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

function updateLatestAccumulated(verseId: string, amount: BigInt, timestamp: BigInt): BigInt {
  let latest = VerseLatestAccumulatedAmount.load(verseId)
  if (!latest) {
    latest = new VerseLatestAccumulatedAmount(verseId)
    latest.amount = BigInt.fromI32(0)
  }

  latest.amount = latest.amount.plus(amount)
  latest.timestamp = timestamp
  latest.save()

  return latest.amount
}

function updateDailyStats(
  verseId: string,
  chainName: string,
  date: string,
  eventType: string,
  amount: BigInt,
  accumulated: BigInt,
  blockTime: BigInt
): void {
  let id = `${date}-${verseId}-${eventType}`
  let stats = DailyBridgeStat.load(id)
  if (!stats) {
    stats = new DailyBridgeStat(id)
    stats.verseId = verseId
    stats.chainName = chainName
    stats.date = date
    stats.eventType = eventType
    stats.total_amount = BigInt.fromI32(0)
    stats.count = BigInt.fromI32(0)
    stats.blockTime = blockTime
  }

  stats.count = stats.count.plus(BigInt.fromI32(1))
  stats.total_amount = stats.total_amount.plus(amount)
  stats.accumulated_amount = accumulated
  stats.blockTime = blockTime

  stats.save()
}

export function handleETHDepositInitiated(event: ETHDepositInitiated): void {
  let verseId = event.address.toHexString()
  let chainName = getChainName(verseId)
  let eventId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  
  let bridgeEvent = new BridgeEvent(eventId)
  bridgeEvent.verseId = verseId
  bridgeEvent.chainName = chainName
  bridgeEvent.eventType = "DEPOSIT"
  bridgeEvent.from = event.params.from
  bridgeEvent.to = event.params.to
  bridgeEvent.amount = event.params.amount
  bridgeEvent.timestamp = event.block.timestamp
  bridgeEvent.blockNumber = event.block.number
  bridgeEvent.transactionHash = event.transaction.hash
  bridgeEvent.extraData = event.params.extraData
  bridgeEvent.save()

  let date = getDayId(event.block.timestamp)
  const accumulated = updateLatestAccumulated(verseId, event.params.amount, event.block.timestamp)
  updateDailyStats(
    verseId,
    chainName,
    date,
    "DEPOSIT",
    event.params.amount,
    accumulated,
    event.block.timestamp
  )
}

export function handleETHWithdrawalFinalized(event: ETHWithdrawalFinalized): void {
  let verseId = event.address.toHexString()
  let chainName = getChainName(verseId)
  let eventId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  
  let bridgeEvent = new BridgeEvent(eventId)
  bridgeEvent.verseId = verseId
  bridgeEvent.chainName = chainName
  bridgeEvent.eventType = "WITHDRAW"
  bridgeEvent.from = event.params.from
  bridgeEvent.to = event.params.to
  bridgeEvent.amount = event.params.amount
  bridgeEvent.timestamp = event.block.timestamp
  bridgeEvent.blockNumber = event.block.number
  bridgeEvent.transactionHash = event.transaction.hash
  bridgeEvent.extraData = event.params.extraData
  bridgeEvent.save()

  let date = getDayId(event.block.timestamp)
  const accumulated = updateLatestAccumulated(verseId, BigInt.fromI32(0).minus(event.params.amount), event.block.timestamp)
  updateDailyStats(
    verseId,
    chainName,
    date,
    "WITHDRAW",
    event.params.amount,
    accumulated,
    event.block.timestamp
  )
}