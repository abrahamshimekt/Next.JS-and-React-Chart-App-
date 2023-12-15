import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { setIsBookmarked } from "@/redux/slice/dataSlice";
import { CatagoryType } from "@/redux/slice/catagorySlice";

export interface ExanteBookmarks {
  [key: string]: { bookmarkName: string; dataset: CatagoryType[] };
}

interface BookmarkFormProps {
  isEdit?: boolean;
  onCloseModal?: () => void;
  bookmark?: string;
}

function BookmarkForm({ isEdit, onCloseModal, bookmark }: BookmarkFormProps) {
  const dispatch = useDispatch();
  const [error, setError] = useState<Boolean>(false);
  const [bookmarkName, setBookmarkName] = useState<string>(bookmark || "");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const selectedItems = useSelector(
    (state: RootState) => state.searchedData.selectedItems
  );

  function handleAddtoBookmark() {
    if (bookmarkName.trim() === "") {
      setErrorMessage("Bookmark name cannot be empty");
      setError(true);
      return;
    }
    let storedData = localStorage.getItem("exante_bookmarks");

    if (!storedData) {
      const defaultBookmarks: ExanteBookmarks = {};
      localStorage.setItem(
        "exante_bookmarks",
        JSON.stringify(defaultBookmarks)
      );
      storedData = JSON.stringify(defaultBookmarks);
    }

    const bookmarks: ExanteBookmarks = JSON.parse(storedData);
    const hasError = Object.values(bookmarks).some((bookmark) => bookmark.bookmarkName === bookmarkName.trim())
    if (hasError) {
      setErrorMessage(`${bookmarkName} name already exist`);
      setError(true);
      return;
    }

    const selectedItemsSortedCopy = selectedItems.map(item => item.name);
    selectedItemsSortedCopy.sort();
    const concatenatedNames = selectedItemsSortedCopy.join();
    bookmarks[concatenatedNames] = {
      bookmarkName : bookmarkName.trim(),
      dataset: selectedItems,
    };

    setBookmarkName("");
    localStorage.setItem("exante_bookmarks", JSON.stringify(bookmarks));
    toast.success(`${bookmarkName} successfully added`);
    dispatch(setIsBookmarked(true));
    onCloseModal && onCloseModal();
  }

  // edit 
  function handleEditBookmark() {
    const storedData = localStorage.getItem("exante_bookmarks");

    if (storedData) {
      let existingBookmarks: ExanteBookmarks = JSON.parse(storedData);
      const selectedItemsSortedCopy = selectedItems.map((ele)=> ele.name).slice();
      selectedItemsSortedCopy.sort();
      const concatenatedNames = selectedItemsSortedCopy.join();

      if (existingBookmarks[concatenatedNames]) {
        existingBookmarks[concatenatedNames].bookmarkName = bookmarkName;
      }

      localStorage.setItem(
        "exante_bookmarks",
        JSON.stringify(existingBookmarks)
      );
      toast.success("Bookmark edited successfully");
      onCloseModal && onCloseModal();
    }
  }


  useEffect(() => {
    setError(false);
  }, [bookmarkName]);

  return (
    <div className="w-[300px] mx-8">
      <p className="text-xl font-medium leading-normal text-neutral-800">
        Enter bookmark name
      </p>
      <input
        className={`p-2 mt-4 focus:outline-stone-300 min-w-full bg-white rounded-md text-black border  ${
          error ? "border-red-500" : "border-stone-600"
        }`}
        type="text"
        name="bookmarkName"
        value={bookmarkName}
        onChange={(e) => {
          setBookmarkName(e.target.value)
        }}
        placeholder="Enter data name"
        onKeyUp={(e) => e.key === "Enter" && bookmarkName.trim() && handleAddtoBookmark()}
      />
      {error && (
        <p className="text-red-500 font-medium text-sm">{errorMessage}</p>
      )}
      <div className="mt-2 flex flex-reverse">
        <button
          className="ml-auto text-sm p-2 bg-primaryButtonColor text-textColorLightGray border border-primaryBorderColor rounded-md hover:bg-primaryButtonHover"
          onClick={isEdit ? handleEditBookmark : handleAddtoBookmark}
          disabled={!bookmarkName}
        >
          {isEdit ? "Edit Bookmark" : "Add to Bookmark"}
        </button>
      </div>
    </div>
  );
}

export default BookmarkForm;
