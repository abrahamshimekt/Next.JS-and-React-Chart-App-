import { LiaCloudUploadAltSolid } from "react-icons/lia";
import FileUploader from "./FileUploader";
import Modal from "./commons/Modal";

function UploadFileButton() {
  return (
    <Modal>
      <Modal.Open opens="upload">
        <button
          className="ml-auto text-sm p-2 bg-primaryButtonColor text-textColorLightGray border border-primaryBorderColor rounded-md hover:bg-primaryButtonHover"
          title="Upload file"
        >
          <LiaCloudUploadAltSolid className="text-6xl text-gray-400" />
          <span>Upload File</span>
        </button>
      </Modal.Open>
      <Modal.Window name="upload">
        <FileUploader />
      </Modal.Window>
    </Modal>
  );
}
export default UploadFileButton;
