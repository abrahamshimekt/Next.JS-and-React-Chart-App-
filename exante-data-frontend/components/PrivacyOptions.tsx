'use client'
import React, { useState } from 'react'
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";


const PrivacyOptions = () => {
    const [privateLoginSelected, selectPrivateLoginSelected] = useState<string>('');
    const [publicSelected, selectPublicSelected] = useState<string>('');
    const [passwordSelected, setPasswordSelected] = useState<boolean>(false);
    const [groupSelected, setGroupSelected] = useState<boolean>(false);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

    const handlePrivateLoginSelected = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        selectPrivateLoginSelected('selected');
    }
    const handlePublicSelected = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        selectPublicSelected('selected');
    }

    const handlePasswordSelected = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setPasswordSelected(!passwordSelected);
    }

    const handleGroupSelected = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setGroupSelected(!groupSelected);
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { value } = event.target;
        if (selectedGroups.includes(value)) {
            setSelectedGroups(selectedGroups.filter(group => group !== value));
        } else {
            setSelectedGroups([...selectedGroups, value]);
        }
    }

    return (
        <div className='flex flex-col justify-start items-start h-200 bg-white text-black w-[400px] border-2 py-5 border-gray-400 rounded-lg'>
            <button className='hover:bg-white hover:text-green-700  w-full flex justify-start pl-2  py-2' onClick={handlePublicSelected}>
                Public
            </button>
            <button className='hover:bg-white hover:text-green-700  w-full flex justify-start pl-2  py-2' onClick={handlePrivateLoginSelected}>
                Private: accessible for logged in users only
            </button>
            <button className='hover:bg-white hover:text-green-700  w-full flex justify-between pl-2  py-2 relative' onClick={handlePasswordSelected}>
                Private: accessible with the following password
                {groupSelected ? <CiCircleChevUp size={20} /> : <CiCircleChevDown size={20} />}
                
            </button>
                {passwordSelected && 
                    <div className='flex w-full justify-center items-center'>
                        <input type='text' className='w-50 h-10 border-2 border-gray-950 ' />
                        
                    </div>
                    
                }
            <button className='hover:bg-white hover:text-green-700  w-full flex justify-between items-center pl-2  py-2' onClick={handleGroupSelected}>
                Private: accessible to users in specific group
                {groupSelected ? <CiCircleChevUp size={20} /> : <CiCircleChevDown size={20} />}
                
            </button>
            {groupSelected && 
                    <div className='flex flex-col justify-center items-start w-full pl-5 border-b-1 border-b-gray-400 bg-white text-black'>
                        <label className='flex flex-start gap-2 items-center'>
                            <input
                                type="checkbox"
                                value="Moderators"
                                onChange={handleCheckboxChange}
                                checked={selectedGroups.includes("Moderators")}
                            />
                            Moderators
                        </label>
                        <label className='flex flex-start gap-2 items-center'>
                            <input
                                type="checkbox"
                                value="Editors"
                                onChange={handleCheckboxChange}
                                checked={selectedGroups.includes("Editors")}
                            />
                            Editors
                        </label>
                    </div>
                }
                <button className='flex items-center justify-center mx-auto px-2 py-1 rounded-md border-2 border-white bg-black text-white hover:bg-white hover:text-black hover:border-black'>Save</button>
        </div>
    )
}

export default PrivacyOptions
