import React from "react";
import LinkButton from "./LinkButton";

interface ConfirmDeleteProps {
  resourceName: string;
  onConfirm: () => void;
  disabled: boolean;
  onCloseModal?: () => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
}) => {
  return (
    <div className="w-full sm:w-72 flex flex-col gap-5 dialog">
      <h3 className="text-base font-semibold">Delete {resourceName}</h3>
      <p className="color-gray-500 mb-5 text-base">
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div className="flex justify-end gap-5">
        <LinkButton
          onClick={onCloseModal}
          buttonType="button"
          color="secondary"
          disabled={disabled}
          text="Cancel"
        />

        <LinkButton
          color="danger"
          onClick={() => {
            onConfirm();
            onCloseModal && onCloseModal();
          }}
          buttonType="submit"
          disabled={disabled}
          text="Delete"
        />
      </div>
    </div>
  );
};

export default ConfirmDelete;
