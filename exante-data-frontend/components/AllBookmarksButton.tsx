import Modal from "@/components/commons/Modal";
import BookmarkList from "./data-visualizer/BookmarkList";

function AllBookmarksButton() {
  return (
    <Modal>
      <Modal.Open opens="all-bookmarks">
        <button
          className="ml-auto text-sm p-2 bg-primaryButtonColor text-textColorLightGray hover:bg-primaryButtonHover border border-primaryBorderColor rounded-md"
          title="All Bookmarks"
        >
          All Bookmarks
        </button>
      </Modal.Open>
      <Modal.Window name="all-bookmarks">
        <BookmarkList />
      </Modal.Window>
    </Modal>
  );
}

export default AllBookmarksButton;
