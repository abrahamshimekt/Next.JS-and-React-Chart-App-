import toast from "react-hot-toast";
import { setIsBookmarked, setSelectedItem, setBookmarkLoaded } from "@/redux/slice/dataSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import BookmarkForm, { ExanteBookmarks } from "./BookmarkForm";
import { IoIosRemoveCircle, IoMdCreate } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa6";
import { TooltipHelper } from "../email-sender/TooltipHelper";
import BookmarkButton from "./BookmarkButton";
import Modal from "../commons/Modal";
import { fetchFundFlows } from "@/redux/actions/fundFlowsActions";
import { CatagoryType } from "@/redux/slice/catagorySlice";
import useLogout from "@/hook/useLogout";


interface BookmarkFormProps {
  onCloseModal?: () => void;
}

function BookmarkList({ onCloseModal }: BookmarkFormProps) {
  const [bookmarks, setBookmarks] = useState<ExanteBookmarks>({});
  const [bookmarksStore, setBookmarksStore] = useState<ExanteBookmarks>({});
  const dispatch: AppDispatch = useDispatch();
    const selectedItems = useSelector(
    (state: RootState) => state.searchedData.selectedItems
  );
  const isBookmarked = useSelector(
    (state: RootState) => state.searchedData.isBookmarked
  );
  const logout = useLogout();

  useEffect(() => {
    const storedData = localStorage.getItem("exante_bookmarks");
    const existingBookmarks: ExanteBookmarks = storedData
      ? JSON.parse(storedData)
      : {};

    setBookmarks({ ...existingBookmarks });
    setBookmarksStore({ ...existingBookmarks });
  }, [selectedItems, isBookmarked]);

  const [searchTerm, setSearchTerm] = useState("");

  function handleRemoveBookmark(bookmarkToRemove: string) {
    try {
      const storedData = localStorage.getItem("exante_bookmarks");

      if (storedData) {
        let existingBookmarks: ExanteBookmarks = JSON.parse(storedData);

        if (existingBookmarks[bookmarkToRemove]) {
          delete existingBookmarks[bookmarkToRemove];
        }

        localStorage.setItem(
          "exante_bookmarks",
          JSON.stringify(existingBookmarks)
        );
        setBookmarks(existingBookmarks);
        setBookmarksStore(existingBookmarks)

        toast.success("Bookmark removed successfully");
        dispatch(setIsBookmarked(false));
      } else {
        toast.error("No bookmarks found");
      }
    } catch (error) {
      toast.error("Error removing bookmark: " + (error as Error).message);
    }
  }

  function handleSearch(searchTerm: string){
    setSearchTerm(searchTerm)
    const filtered = Object.fromEntries(
      Object.entries(bookmarksStore)
        .filter(([key, value]) => value.bookmarkName.toLowerCase().includes(searchTerm.toLowerCase()) || key.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setBookmarks(filtered)
  }


  // edit bookmark
  function handleEditBookmark(bookmarkToEdit: CatagoryType) {
    const storedData = localStorage.getItem("exante_bookmarks");

    if (storedData) {
      let existingBookmarks: ExanteBookmarks = JSON.parse(storedData);

      if (existingBookmarks[bookmarkToEdit.name]) {
        dispatch(setBookmarkLoaded(true))
        dispatch(setSelectedItem(existingBookmarks[bookmarkToEdit.name].dataset));
      }
    }
  }

  function handleLoadItem(bookmarkToLoad: CatagoryType[]) {
    dispatch(setBookmarkLoaded(true))
    if(selectedItems != bookmarkToLoad){
      if (selectedItems.length) {
        dispatch(setSelectedItem([]));
      }
      dispatch(setSelectedItem(bookmarkToLoad));
      bookmarkToLoad.forEach((element:CatagoryType) => {
        // dispatch(fetchFundFlows(element));
        dispatch(
          fetchFundFlows({
            category: element,
            logoutCallback: logout,
          })
        );

      });
      onCloseModal?.();
    }
  }
  
  function handleRemoveAll(){
    localStorage.removeItem("exante_bookmarks");
    setBookmarks({});
    dispatch(setIsBookmarked(false));
    toast.success("All bookmarks removed");
  }

  return (
    <div className="min-h-full min-w-full overflow-y-auto ">
      <div className="justify-end mb-2 flex">
        <BookmarkButton />
      </div>
      {Object.keys(bookmarks).length === 0 && searchTerm.length==0? (
        <div className="p-1.5 border rounded-lg relative bg-[#0D2447] text-[#fff]">
          <div className="flex mb-2 min-h-full justify-between">
            {/* <div></div> */}
            <FaFolderOpen className="text-xl text-white" />
          <div className="font-medium text-ml text-center text-slate-100">
            All Bookmarks
          </div>
            <TooltipHelper />
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto sm:rounded-md min-h-full min-w-full border">
    <div className="text-lg p-3 text-center bg-primaryButtonColor text-textColorLightGray">
      Bookmarks
    </div>
    <div className="flex justify-center px-0.5 bg-primaryButtonColor">
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={event => handleSearch(event.target.value)}
      className="min-w-full p-2 rounded-full m-2 outline-none"
    />
    </div>  
    <div className="flex flex-col">
      {Object.keys(bookmarks).map((concatDatasetNames, index) => (
        <div
          key={concatDatasetNames}
          onClick={() =>
            handleLoadItem(bookmarks[concatDatasetNames].dataset)
          }
          className="bg-gray-200 border-b mt-1 px-1 flex justify-between min-w-full hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <div>{bookmarks[concatDatasetNames].bookmarkName}</div>
          <div>
            <Modal>
            <Modal.Open opens="editBookmark">
            <button
              className="text-sm text-blue-500 px-2 py-1 hover:bg-blue-200 rounded-md transition-all duration-300 ease-in-out"
              >
              <IoMdCreate size={20} />
            </button>
            </Modal.Open>
            <Modal.Window name="editBookmark">
              <BookmarkForm
                onCloseModal={() => {
                  onCloseModal?.();
                }}
                bookmark = {bookmarks[concatDatasetNames].bookmarkName}
                isEdit={true}
              />
            </Modal.Window>
              </Modal>

            <button
              className="text-sm text-red-500 px-2 py-1 hover:bg-red-200 rounded-md transition-all duration-300 ease-in-out"
              onClick={() => handleRemoveBookmark(concatDatasetNames)}
            >
              <IoIosRemoveCircle size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
      )}
    </div>
  );
}

export default BookmarkList;
