"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBookmarkLoaded, setSelectedItem } from "../../redux/slice/dataSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Multiselect from "multiselect-react-dropdown";
import { CatagoryType } from "@/redux/slice/catagorySlice";
import { fetchFundFlows } from "@/redux/actions/fundFlowsActions";
import { removeItem, filterUnselected } from "@/redux/slice/dataLoaderSlice";
import useLogout from "@/hook/useLogout";

const Searchbar = () => {
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const logout = useLogout();
  const {
    loading:catagoryLoading,
    categories: suggestions,
    error,
  } = useSelector((state: RootState) => state.category);
  const selectedItems = useSelector(
    (state: RootState) => state.searchedData.selectedItems
  );
  const { loading} = useSelector(
    (state: RootState) => state.fundData
  );

  useEffect(()=>{
    const selectedItemsList = selectedItems.map(({ name }) => name);
    dispatch(filterUnselected(selectedItemsList))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loading])

  const handleMultiSelectSearch = (value: any) => {
    setSearch(value);
  };

  const handleSuggestionsClick = (newSelections: CatagoryType[], selectedItem:CatagoryType) => {
    // dispatch(fetchFundFlows(selectedItem));
    dispatch(
      fetchFundFlows({
        category: selectedItem,
        logoutCallback: logout,
      })
    );
    dispatch(setBookmarkLoaded(false));
    dispatch(setSelectedItem([...newSelections]));
  };

  const handleRemoveSuggestionsClick = (
    newSelections: CatagoryType[],
    removedItem: CatagoryType
  ) => {
    dispatch(removeItem(removedItem.name));
    dispatch(setBookmarkLoaded(false));
    dispatch(setSelectedItem([...newSelections]));
  };

  return (
    <div className="bg-white rounded-md w-full">
      <Multiselect
        onSearch={handleMultiSelectSearch}
        isObject={true}
        closeOnSelect={true}
        options={suggestions}
        selectedValues={selectedItems} // Preselected value to persist in dropdown
        onSelect={handleSuggestionsClick} // Function will trigger on select event
        onRemove={handleRemoveSuggestionsClick} // Function will trigger on remove event
        displayValue="name" // Display the "name" property in the dropdown
        id="id"
        selectedValueDecorator={(value) => {
          if (!value) {
            return;
          }
          const maxLength = 20; // Change this value as needed

          // Shorten the value if it exceeds the maximum length
          return value.length > maxLength
            ? value.substring(0, maxLength) + "..."
            : value;
        }}
        style={{
          multiselectContainer: {
            zIndex: 15,
          },
          chips: {
            background: "#019cd2",
          },
        }}
        showCheckbox
      />
    </div>
  );
};

export default Searchbar;
