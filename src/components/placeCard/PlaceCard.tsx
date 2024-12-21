import { motion } from "framer-motion";
import { FaCity, FaPlusCircle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
    IDates,
    IDatesStorage,
    IPositions,
} from "../../interfaces/placeCard/interface";

const animationVariants = {
    whileHover: {
        scale: 1.1,
        transition: { duration: 0.1 },
    },
    whileTap: {
        scale: 0.85,
        transition: { duration: 0.1 },
    },
};

interface PlaceCardProps {
    positions: IPositions[];
    selectedPosition: number | null;
    setOpenPlaceCard: Dispatch<SetStateAction<boolean>>;
    datesStorage: IDatesStorage;
    updateDatesStorage: (markerId: number, dates: IDates[]) => void;
    setRouteBlocked: Dispatch<SetStateAction<boolean>>;
    dates: IDates[];
    setDates: Dispatch<SetStateAction<IDates[]>>;
}

export default function PlaceCard({
    positions,
    selectedPosition,
    setOpenPlaceCard,
    datesStorage,
    updateDatesStorage,
    setRouteBlocked,
    dates,
    setDates,
}: PlaceCardProps) {
    const todayDate = new Date();
    const formattedTodayDate = `${todayDate.getDate() < 10 ? "0" + todayDate.getDate() : todayDate.getDate()}/${todayDate.getMonth() + 1 < 10 ? "0" + (todayDate.getMonth() + 1) : todayDate.getMonth() + 1}`;
    const positionId = selectedPosition !== null ? selectedPosition - 1 : 0;

    useEffect(() => {
        setDates(datesStorage[positionId] || []);
    }, [setDates, datesStorage, positionId]);

    useEffect(() => {
        if (!dates.some((dateObj) => dateObj.date === formattedTodayDate)) {
            const newDates = [
                ...dates,
                {
                    id: dates.length + 1,
                    date: formattedTodayDate,
                    active: false,
                },
            ];

            setDates(newDates);
            updateDatesStorage(positionId, newDates);
        }
    }, [setDates, formattedTodayDate, dates, positionId, updateDatesStorage]);

    const handleDateStorage = () => {
        const nextDay = new Date(todayDate);
        nextDay.setDate(todayDate.getDate() + dates.length);
        const formattedNextDay = `${nextDay.getDate() < 10 ? "0" + nextDay.getDate() : nextDay.getDate()}/${nextDay.getMonth() + 1 < 10 ? "0" + (nextDay.getMonth() + 1) : nextDay.getMonth() + 1}`;

        const newDates = [
            ...dates,
            { id: dates.length + 1, date: formattedNextDay, active: false },
        ];

        setDates(newDates);
        updateDatesStorage(positionId, newDates);
    };

    const handleActivateDate = (id: number) => {
        const updatedDates = dates.map((dateObj) => {
            if (dateObj.id === id) {
                return { ...dateObj, active: !dateObj.active };
            }
            return dateObj;
        });

        setDates(updatedDates);
        updateDatesStorage(positionId, updatedDates);
        setRouteBlocked(false);
    };

    useEffect(() => {
        const isAnyDateActive = dates.some((dateObj) => dateObj.active);
        if (!isAnyDateActive && window.map && window.map.removeRoute) {
            window.map.removeRoute();
        }
    }, [dates]);

    return (
        <div className="place-card absolute -inset-y-10 w-screen md:w-full h-[calc(100%+40px)] bg-white dark:bg-second-black overflow-y-hidden z-[1099] transition-colors duration-700">
            <div className="place-card-scroll h-full overflow-y-auto">
                <motion.div
                    className="btn-back_place-card"
                    onClick={() => setOpenPlaceCard(false)}
                    variants={animationVariants}
                    whileHover="whileHover"
                    whileTap="whileTap"
                >
                    <IoArrowBack className="w-[30px] h-[30px] text-white" />
                </motion.div>
                <div className="place-info max-w-x">
                    <img
                        className="w-full h-1/2"
                        src={positions[positionId].img}
                        alt={positions[positionId].name}
                    />
                    <h1 className="mt-3 mb-3 px-4 dark:text-white text-2xl sm:text-3xl font-bold transition-colors duration-700">
                        {positions[positionId].name}
                    </h1>
                    <p className="icon-paragraph_place-card mb-2 pt-1 px-4">
                        <BiSolidCategory className="icon_place-card" />
                        Category: {positions[positionId].category}
                    </p>
                    <p className="icon-paragraph_place-card px-4 pb-4">
                        <FaCity className="icon_place-card" />
                        City/Village: {positions[positionId].location}
                    </p>
                </div>
                <div className="date-trip grid grid-cols-5 gap-2 my-3 px-4">
                    {dates.map((elem) => (
                        <motion.div
                            key={elem.id}
                            className={`date-box_place-card ${
                                elem.active ? "bg-blue-900" : ""
                            }`}
                            onClick={() => handleActivateDate(elem.id)}
                            variants={animationVariants}
                            whileTap="whileTap"
                        >
                            {elem.date}
                        </motion.div>
                    ))}
                    <motion.div
                        className="date-box_place-card"
                        onClick={handleDateStorage}
                        variants={animationVariants}
                        whileTap="whileTap"
                    >
                        <FaPlusCircle className="w-10/12 h-1/2" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
