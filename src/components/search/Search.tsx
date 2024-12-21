import { motion } from "framer-motion";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { IPositions } from "../../interfaces/search/interface";

interface SearchProps {
    positions: IPositions[];
    valueLocation: string;
    valueName: string;
    setValueLocation: Dispatch<SetStateAction<string>>;
    setValueName: Dispatch<SetStateAction<string>>;
    setZoomLocationX: Dispatch<SetStateAction<number>>;
    setZoomLocationY: Dispatch<SetStateAction<number>>;
    setSelectedPosition: Dispatch<SetStateAction<number | null>>;
    setOpenPlaceCard: Dispatch<SetStateAction<boolean>>;
}

export default function Search({
    positions,
    valueLocation,
    valueName,
    setValueLocation,
    setValueName,
    setZoomLocationX,
    setZoomLocationY,
    setSelectedPosition,
    setOpenPlaceCard,
}: SearchProps) {
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleChangeLocation = (e: ChangeEvent<HTMLInputElement>) => {
        setValueLocation(e.target.value.toLowerCase());
    };

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setValueName(e.target.value.toLowerCase());
    };

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(category)
                ? prevSelected.filter((cat) => cat !== category)
                : [...prevSelected, category],
        );
    };

    const handleZoomLocation = (x: number, y: number, key: number) => {
        setZoomLocationX(x);
        setZoomLocationY(y);
        setSelectedPosition(key);
        setOpenPlaceCard(true);
    };

    const uniqueCategories = [...new Set(positions.map((pos) => pos.category))];

    const filteredPositions = positions.filter(
        (elem) =>
            elem.name.toLowerCase().includes(valueName) &&
            elem.location.toLowerCase().includes(valueLocation) &&
            (selectedCategories.length === 0 ||
                selectedCategories.includes(elem.category)),
    );

    return (
        <div className="search absolute flex flex-col w-screen md:w-full h-full px-3 bg-white dark:bg-second-black z-[1001] transition-colors duration-700">
            <h1 className="mt-5 dark:text-white text-2xl sm:text-3xl font-bold">
                Search
            </h1>
            <input
                className="input_search"
                type="text"
                placeholder="Location"
                onChange={handleChangeLocation}
            />
            <input
                className="input_search"
                type="text"
                placeholder="Place name"
                onChange={handleChangeName}
            />
            <div className="relative">
                <motion.input
                    onClick={handleDropdownToggle}
                    className="btn-category_search"
                    type="button"
                    value="Select category"
                    whileTap={{ scale: 0.85 }}
                />

                {dropdownVisible && (
                    <div className="absolute w-full mt-2 bg-white dark:bg-second-black rounded-lg shadow border z-10 transition-colors duration-700">
                        <ul className="p-3 space-y-1 text-sm">
                            {uniqueCategories.map((category, key) => (
                                <li key={key}>
                                    <motion.div
                                        className="flex items-center p-2 rounded hover:bg-gray-100 hover:dark:bg-gray-900 transition-colors duration-700"
                                        whileTap={{ scale: 0.85 }}
                                    >
                                        <input
                                            id={`checkbox-item-${key}`}
                                            type="checkbox"
                                            value={category}
                                            checked={selectedCategories.includes(
                                                category,
                                            )}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            onChange={() =>
                                                handleCategoryChange(category)
                                            }
                                        />
                                        <label
                                            htmlFor={`checkbox-item-${key}`}
                                            className="w-full ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 rounded transition-colors duration-700"
                                        >
                                            {category}
                                        </label>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="card-search grid justify-items-center mt-3 p-2 rounded overflow-x-hidden overflow-y-scroll">
                {filteredPositions.map((elem) => (
                    <a
                        key={elem.id}
                        href="#"
                        className="place-card_search"
                        onClick={() =>
                            handleZoomLocation(elem.x, elem.y, elem.id)
                        }
                    >
                        <img
                            className="object-cover w-full h-36 rounded-t-lg"
                            src={elem.img}
                            alt={elem.name}
                        />
                        <div className="p-4">
                            <h5 className="tracking-tight text-gray-900 dark:text-gray-100 font-bold  transition-colors duration-700">
                                {elem.name}
                            </h5>
                            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm font-normal transition-colors duration-700">
                                {elem.category}
                            </p>
                            <p className="dark:text-white text-sm italic font-normal transition-colors duration-700">
                                {elem.location}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
