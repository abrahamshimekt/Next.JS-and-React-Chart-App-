import React, { useState } from "react";
import Image from "next/image";

 type DataSource = ("exante" | "bloomberg" | "haver" | "macrobond" )
const DataSourcesMenu  = () => {

  const [connectedSources, setConnectedSources] = useState({
    exante: true,
    bloomberg: true,
    haver: true,
    macrobond: true
  });

  const handleConnectChange = (source: DataSource) => {
    setConnectedSources(prevState => ({
      ...prevState,
      [source]: !prevState[source]
    }));
  };

  const [active, setactive] = useState(false)

  return (
    <div className="w-full lg:w-full pr-1 relative">
      <button onClick={(e)=> setactive(!active)} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white  bg-[#0D2447]  font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center  dark:hover:bg-gray-100 dark:focus:ring-blue-800 w-full justify-between" type="button"><p className="font-semibold text-lg">Data Feeds</p> <svg className="w-2.5 h-2 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      <div id="dropdown" className={`${ active ? "d-block" : "hidden"} z-10  rounded-lg shadow w-full `}>
          <ul className="w-full py-2 text-sm text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li className={`my-1 cursor-pointer hover:bg-primaryButtonHover rounded-lg hover:text-white ${connectedSources.exante && " bg-primaryButtonHover text-white"}`} onClick={() => handleConnectChange('exante')} >
              <div className="px-4 py-2  w-full flex justify-between"> <p className="font-semibold flex gap-2 text-sm"><Image src={"/bar.png"} width={27} height={27} alt=""/> Exante</p> <input className="" type="checkbox" onChange={()=>{}} checked = {connectedSources.exante}/> </div>
            </li>
            <li className={`my-1 cursor-pointer hover:bg-primaryButtonHover 
            rounded-lg hover:text-white ${connectedSources.bloomberg && "bg-primaryButtonHover text-white"}`} onClick={() => handleConnectChange('bloomberg')} >
              <div className="px-4 py-2  w-full flex justify-between"> <p className="font-semibold flex gap-2 text-sm"><Image src={"/pie.png"} width={27} height={27} alt=""/> Bloomberg</p> <input className="" type="checkbox" onChange={()=>{}} checked = {connectedSources.bloomberg}/> </div>
            </li>
            <li className={`my-1 cursor-pointer hover:bg-primaryButtonHover 
            rounded-lg hover:text-white ${connectedSources.haver && "bg-primaryButtonHover text-white"}`} onClick={() => handleConnectChange('haver')} >
              <div className="px-4 py-2  w-full flex justify-between"> <p className="font-semibold flex gap-2 text-sm"><Image src={"/line.png"} width={27} height={27} alt=""/> Haver</p> <input className="" type="checkbox" onChange={()=>{}} checked = {connectedSources.haver}/> </div>
            </li>
            <li className={`my-1 cursor-pointer hover:bg-primaryButtonHover 
            rounded-lg hover:text-white ${connectedSources.macrobond && " bg-primaryButtonHover text-white "}`} onClick={() => handleConnectChange('macrobond')} >
              <div className="px-4 py-2  w-full flex justify-between"> <p className="font-semibold flex gap-2 text-sm"><Image src={"/empty-folder.png"} width={27} height={27} alt=""/> Macrobond</p> <input className="" type="checkbox" onChange={()=>{}} checked = {connectedSources.macrobond}/> </div>
            </li>
          </ul>
      </div>
    </div>
  );
};

export default DataSourcesMenu ;