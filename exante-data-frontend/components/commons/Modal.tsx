import styled, { keyframes } from "styled-components";
import { HiXMark } from "react-icons/hi2";
import { createPortal } from "react-dom";
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useOutsideClick } from "@/hook/useOutsideClick";

const slideUp = keyframes`
    0% {
        transform: translateY(100%) translateX(-50%);
        opacity: 0
    }
    100% {
        transform: translateY(-50%) translateX(-50%);
        opacity: 1;
    }
`;

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transform: translate(-50%, -50%);
  transition: all 0.5s;
  animation: ${slideUp} 0.5s forwards;
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: calc(
    100vh - 4rem
  ); /* Set max-height to allow scrolling within viewport */

  @media (max-width: 768px) {
    width: 100%;
    padding: 2rem;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  animation: appear 350ms ease-in 1;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    color: var(--color-grey-500);
  }
`;

type ModalContextType = {
  openName: string;
  open: (name: string) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType>({
  openName: "",
  open: () => {},
  close: () => {},
});

type ModalProps = {
  children: ReactNode;
};

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState("");

  const open = (name: string) => setOpenName(name);
  const close = () => setOpenName("");

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

type OpenProps = {
  children: ReactNode;
  opens: string;
};

function Open({ children, opens }: OpenProps) {
  const { open } = useContext(ModalContext);

  return cloneElement(children as React.ReactElement, {
    onClick: () => open(opens),
  });
}

type WindowProps = {
  children: ReactNode;
  name: string;
};

function Window({ children, name }: WindowProps) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  useEffect(() => {
    document.body.style.overflow = openName ? "hidden" : "visible";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [openName]);

  if (name !== openName) return null;

  return createPortal(
    <>
      <Overlay>
        <StyledModal ref={ref} id="modal-dropdown">
          <Button onClick={close} aria-label="Close Modal">

            <HiXMark />
          </Button>
          <div>
            {cloneElement(children as React.ReactElement, {
              onCloseModal: close,
            })}
          </div>
        </StyledModal>
      </Overlay>
    </>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
