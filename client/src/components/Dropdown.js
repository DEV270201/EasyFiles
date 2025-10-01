import React,{useContext} from "react";
import { ThemeContext } from "../context/ThemeContext";
import { ClockArrowDown, ClockArrowUp, ArrowUpAZ, ArrowDownAZ } from "lucide-react";

const valueToIcon = {
    "Oldest" : <ClockArrowUp className="size-5" />,
    "Latest" : <ClockArrowDown className="size-5" />,
    "A-Z": <ArrowUpAZ className="size-5" />,
    "Z-A": <ArrowDownAZ className="size-5" />
}

const Dropdown = ({func,name}) => {
    const {Theme} = useContext(ThemeContext);
  
    const hello = (e)=>{
          func(e.target.innerText);
    }

    return (
        <>
            <div className="w-32">
                <button className={`flex items-center gap-2 dropdown-toggle outline-none w-full btn bg-darkaccent border-limegreen text-limegreen hover:bg-limegreen hover:text-black`} id="dropdownMenuLink" data-toggle="dropdown" aria-expanded="false">
                   <span>{valueToIcon[name]}</span> {name}
                </button>
                <ul className="dropdown-menu bg-deepblack border text-gray-200" aria-labelledby="dropdownMenuLink">
                 <li className={`mx-1 p-1 font-bold hover:cursor-pointer hover:bg-darkaccent ${name === 'Oldest' && 'bg-darkaccent'} flex gap-2`} onClick={hello}><span>{valueToIcon['Oldest']}</span>Oldest</li>
                 <li className={`mx-1 p-1 font-bold hover:cursor-pointer hover:bg-darkaccent ${name === 'Latest' && 'bg-darkaccent'} flex gap-2 `} onClick={hello}><span>{valueToIcon['Latest']}</span>Latest</li>
                 <li className={`mx-1 p-1 font-bold hover:cursor-pointer hover:bg-darkaccent ${name === 'A-Z' && 'bg-darkaccent'} flex gap-2`} onClick={hello}><span>{valueToIcon['A-Z']}</span>A-Z</li>
                 <li className={`mx-1 p-1 font-bold hover:cursor-pointer hover:bg-darkaccent ${name === 'Z-A' && 'bg-darkaccent'} flex gap-2`} onClick={hello}><span>{valueToIcon['Z-A']}</span>Z-A</li>
                </ul>
            </div>
        </>
    );
}

export default React.memo(Dropdown);