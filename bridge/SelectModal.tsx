import Image from 'next/image';

export interface SelectListItem {
  id: number;
  image: string;
  text: string;
}

interface SelectModalProps {
  headerText: string;
  items: Array<SelectListItem>;
  onClose: () => void;
  onSelect: (id: number) => void;
}

export const SelectModal = ({
  headerText,
  items,
  onClose,
  onSelect,
}: React.PropsWithChildren<SelectModalProps>) => {
  const select = (id: number) => {
    onSelect(id);
    onClose();
  };

  return (
    <div
      id="select-modal"
      aria-hidden="true"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      { /* back drop */ }
      <div className="opacity-35 fixed inset-0 z-0 bg-black" onClick={ () => onClose() }></div>
      { /* content */ }
      <div className="relative p-6 max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
        { /* header */ }
        <div className="pb-2 rounded-t">
          <h2 className="text-xl w-full font-semibold text-gray-900">{ headerText }</h2>
          { /* <input /> */ }
        </div>
        <div className="relative flex w-96 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
          <nav className="flex min-w-[240px] flex-col gap-1 p-1.5">
            { items.map((item) => (
              <div
                key={ item.id }
                role="button"
                className="text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                onClick={ () => select(item.id) }
              >
                <div className="mr-4 grid place-items-center">
                  <Image
                    src={ item.image || '' }
                    alt={ item.text }
                    width={ 16 }
                    height={ 16 }
                    className="mr-2 relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                  />
                </div>
                <div>
                  <h6 className="text-slate-800 font-medium text-medium">
                    { item.text }
                  </h6>
                </div>
              </div>
            )) }
          </nav>
        </div>
      </div>
    </div>
  );
};
