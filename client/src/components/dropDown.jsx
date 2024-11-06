import { useEffect, useState } from "react";


export default function DropDown({categories, filterAuctions}){

    return(
        <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">Hover</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {categories.map((category) =>(<li id={category}><button onClick={filterAuctions}>{category}</button></li>))}         
            </ul>
        </div>
    )
};  