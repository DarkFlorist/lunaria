import { ComponentChild } from 'preact';
interface ModalProps {
    title?: string;
    hasCloseButton?: boolean;
    onClickOutside?: () => void;
    onClose: () => void;
    children: ComponentChild;
}
export declare const Modal: ({ onClose, children, hasCloseButton, title, onClickOutside }: ModalProps) => import("preact").JSX.Element;
export default Modal;
//# sourceMappingURL=Modal.d.ts.map