import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BookmarkForm, { ExanteBookmarks } from "@/components/data-visualizer/BookmarkForm";
import Modal from "@/components/commons/Modal";
import { RootState } from "@/redux/store";
import { setIsBookmarked } from "@/redux/slice/dataSlice";
import { TiFolderAdd, TiFolderDelete } from "react-icons/ti";

type SvgProps = {
  color: string;
};

const Svg = ({ color }: SvgProps) => (
  <svg
    height="20px"
    width="20px"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
  >
    <path
      style={{ fill: color }}
      d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
    />
  </svg>
);

function BookmarkButton() {
  const dispatch = useDispatch();
  const isBookmarked = useSelector(
    (state: RootState) => state.searchedData.isBookmarked
  );
  const selectedItems = useSelector(
    (state: RootState) => state.searchedData.selectedItems
  );
  const [isHovered, setIsHovered] = useState(false);

  function handleRemoveBookmark() {
    try {
      // TODO: The keys we used is concatenated dataset names. We need to sort them to make sure we are removing the correct bookmark. Think of a better way to do this.
      const selectedItemsSortedCopy = selectedItems.map((ele)=> ele.name).slice();
      selectedItemsSortedCopy.sort();
      const bookmarkkey = selectedItemsSortedCopy.join();
      const storedData = localStorage.getItem("exante_bookmarks");

      if (storedData) {
        let existingBookmarks: ExanteBookmarks = JSON.parse(storedData);

        if (existingBookmarks[bookmarkkey] === undefined) {
          return;
        }

        delete existingBookmarks[bookmarkkey];

        localStorage.setItem(
          "exante_bookmarks",
          JSON.stringify(existingBookmarks)
        );

        toast.success("Bookmark removed successfully");
        dispatch(setIsBookmarked(false));
      } else {
        toast.error("No bookmarks found");
      }
    } catch (error) {
      toast.error("Error removing bookmark: " + (error as Error).message);
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem("exante_bookmarks");

    if (storedData) {
      const bookmarks: ExanteBookmarks = JSON.parse(storedData);

      const selectedItemsSortedCopy = selectedItems.map((ele)=> ele.name).slice();
      selectedItemsSortedCopy.sort();
      if (bookmarks[selectedItemsSortedCopy.join()] === undefined) {
        dispatch(setIsBookmarked(false));
      } else {
        dispatch(setIsBookmarked(true));
      }
    }
  }, [dispatch, isBookmarked, selectedItems]);

  return (
    <>
      {isBookmarked ? (
        <button
          className="ml-auto text-sm p-2 text-[#0000008c] border border-stone-300 rounded-md top-2 left-2 z-10"
          title="Remove Bookmark"  // Updated title attribute
          onClick={handleRemoveBookmark}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Remove Bookmark"  // Added aria-label attribute
        >
          <div className="justify-center flex flex-row gap-2">
            <TiFolderDelete fontWeight={200} size={24} color="#ED8A19" />
            {isHovered && <span className="text-white text-md">Remove</span>}
          </div>
        </button>
      ) : (
        <Modal>
          <Modal.Open opens="bookmarks">
            <button
              className="ml-auto text-sm p-2 text-[#0000008c] border border-stone-300 rounded-md top-2 left-2 z-10"
              title="Add to Bookmark"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Add to Bookmark"  // Added aria-label attribute
            >
              <div className="justify-center flex flex-row gap-2">
                <TiFolderAdd fontWeight={200} size={24} color="#bbb" />
                {isHovered && <span className="text-white">Add</span>}
              </div>
            </button>
          </Modal.Open>

          <Modal.Window name="bookmarks">
            <BookmarkForm />
          </Modal.Window>
        </Modal>
      )}
    </>
  );
}

export default BookmarkButton;
