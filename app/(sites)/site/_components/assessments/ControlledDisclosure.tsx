import { Fragment, useState, useEffect, ReactNode, useRef } from "react";
import { Disclosure } from "@headlessui/react";

interface ControlledDisclosureProps {
  children: ({ closeDisclosure }: { closeDisclosure: () => void }) => ReactNode;
  buttonClassName: string;
  buttonContent: (open: boolean) => ReactNode;
  panelClassName: string;
}

const ControlledDisclosure: React.FC<ControlledDisclosureProps> = ({
  children,
  buttonClassName,
  buttonContent,
  panelClassName,
}) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setOpen(!open);
  const closeDisclosure = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        closeDisclosure();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <Disclosure as={Fragment}>
      {() => (
        <>
          <Disclosure.Button onClick={toggleOpen} className={buttonClassName}>
            {buttonContent(open)}
          </Disclosure.Button>
          {open && (
            <Disclosure.Panel static className={panelClassName} ref={panelRef}>
              {children({ closeDisclosure })}
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
};

export default ControlledDisclosure;
