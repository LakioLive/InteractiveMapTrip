import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../style/index.scss";
import L from "leaflet";
import { IDates, IDatesStorage, ISortedDates } from "../interfaces/interface";

import Map from "./map/Map";
import Navbar from "./navbar/Navbar";
import Search from "./search/Search";
import PlaceCard from "./placeCard/PlaceCard";
import Trip from "./trip/Trip";
import DarkModeBtn from "./ui/darkModeBtn/DarkModeBtn";

const positions = [
    {
        id: 1,
        name: "Sky Tower",
        img: "https://ocdn.eu/pulscms/MDA_/f3c0e553ba7b0bcdbc01e4d6d372945e.jpg",
        x: 51.0945,
        y: 17.0197,
        location: "Wrocław",
        category: "Shopping center",
        time: 3600,
    },
    {
        id: 2,
        name: "Antalya Kebab u Bogusi",
        img: "https://d-art.ppstatic.pl/kadry/k/r/1/22/1e/65c0e1f838515_o_full.jpg",
        x: 50.551,
        y: 18.0,
        location: "Opole",
        category: "Restaurant",
        time: 1800,
    },
    {
        id: 3,
        name: "Zagłębiowski Park Sportowy - ArcelorMittal Park",
        img: "https://lh5.googleusercontent.com/proxy/RfFucqcqYCBiq_-rsoPjGje67Cy9R1Zmtkkdp6dbq0ajWAjKj3iTu-T0dfSQGQvIpXwd39FVrJG14EcAFqKI7uG77jUezUOzodPpTDN8MUdHOH_BIzUthZ-4aN947xS6W0-BUGv8vxoDZdWoGu1WAN6BjOKoW1c-",
        x: 50.201,
        y: 19.0,
        location: "Sosnowiec",
        category: "Park",
        time: 1800,
    },
    {
        id: 4,
        name: "Camper & Camping Park",
        img: "https://cdn2.acsi.eu/6/5/7/e/657eb320d5a9c.jpg?impolicy=gallery-detail",
        x: 54.301,
        y: 18.65,
        location: "Gdańsk",
        category: "Park",
        time: 1800,
    },
    {
        id: 5,
        name: "Municipal Sports and Recreation Center in Płońsk",
        img: "https://ciechanow.cozadzien.pl/img/2020/04/30/_min/10e2c8dc13504108cd96a7ac5b14f8e2.jpg",
        x: 52.501,
        y: 17.0,
        location: "Płońsk",
        category: "Health center",
        time: 3600,
    },
    {
        id: 6,
        name: "Barlinek Landscape Park",
        img: "https://www.zpkwz.pl/images/barlinecki_park_projekt.jpg",
        x: 52.001,
        y: 15.0,
        location: "Barlinek",
        category: "Park",
        time: 1800,
    },
    {
        id: 7,
        name: "Galeria Łódzka",
        img: "https://www.galeria-lodzka.pl/fileadmin/user_upload/TEST/Stage_images/GLL_photos/GL_STRONA_WWW_1920X1080_2.jpg",
        x: 51.701,
        y: 19.5,
        location: "Łódź",
        category: "Shopping center",
        time: 3600,
    },
    {
        id: 8,
        name: "Zegrzyńskie Lake Beach",
        img: "https://inmasovianstyle.com/wp-content/uploads/2022/07/nieporet_2021_1-1170x680-1-1170x680.jpg",
        x: 53.001,
        y: 19.0,
        location: "Nieporęt",
        category: "Swimming complex",
        time: 3600,
    },
    {
        id: 9,
        name: "Star Paintball",
        img: "https://hydra.fit/cdn/shop/files/image_aa9199bd-0bd3-4461-9b77-af47c452d735_1024x1024.heic?v=1683040367",
        x: 53.251,
        y: 15.0,
        location: "Szczecin",
        category: "Paintball center",
        time: 5400,
    },
    {
        id: 10,
        name: "Plaza Rzeszów",
        img: "https://pliki.propertynews.pl/i/04/43/51/044351_r0_940.jpg",
        x: 50.001,
        y: 22.0,
        location: "Rzeszów",
        category: "Shopping center",
        time: 3600,
    },
    {
        id: 11,
        name: "Frangos Pizza & Burger House",
        img: "https://smacznego.moja-ostroleka.pl/libs/r.php?src=https://smacznego.moja-ostroleka.pl/uploads/smacznego/frangos/frangos_308.jpg&w=600",
        x: 53.071,
        y: 21.58,
        location: "Ostrołęka",
        category: "Restaurant",
        time: 1800,
    },
    {
        id: 12,
        name: "Queen Mama",
        img: "https://d-art.ppstatic.pl/kadry/k/r/1/d4/70/5ef5ec75052b3_o_large.jpg",
        x: 51.201,
        y: 22.6,
        location: "Lublin",
        category: "Restaurant",
        time: 1800,
    },
    {
        id: 13,
        name: "Monument of the Uprising Act on Mount St. Anna",
        img: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Pomnik_Czynu_Powsta%C5%84czego.jpg",
        x: 50.501,
        y: 18.2,
        location: "Lublin",
        category: "Military monument",
        time: 3600,
    },
];

const animationSettings = {
    initial: {
        width: 0,
    },
    animate: {
        width: 400,
        transition: {
            duration: 0.5,
            delay: 0.5,
        },
    },
    exit: {
        width: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function App() {
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [valueLocation, setValueLocation] = useState<string>("");
    const [valueName, setValueName] = useState<string>("");
    const [zoomLocationX, setZoomLocationX] = useState<number>(52.083);
    const [zoomLocationY, setZoomLocationY] = useState<number>(19.375);
    const [selectedPosition, setSelectedPosition] = useState<number | null>(
        null,
    );
    const [openPlaceCard, setOpenPlaceCard] = useState<boolean>(false);
    const [datesStorage, setDatesStorage] = useState<IDatesStorage>({});
    const [openTrip, setOpenTrip] = useState<boolean>(false);
    const [showRoute, setShowRoute] = useState<boolean>(false);
    const [transportMode, setTransportMode] = useState<string>("car");
    const [routingControl, setRoutingControl] =
        useState<L.Routing.Control | null>(null);
    const [sortedDates, setSortedDates] = useState<ISortedDates[]>([]);
    const [routeBlocked, setRouteBlocked] = useState<boolean>(false);
    const [dates, setDates] = useState<IDates[]>([]);

    const updateDatesStorage = (markerId: number, dates: IDates[]) => {
        setDatesStorage((prevState) => ({
            ...prevState,
            [markerId]: dates,
        }));
    };

    return (
        <div className="app flex flex-col h-svh">
            <div className="flex-grow flex">
                <div className="hidden md:flex">
                    <Navbar
                        openSearch={openSearch}
                        setOpenSearch={setOpenSearch}
                        setOpenPlaceCard={setOpenPlaceCard}
                        openTrip={openTrip}
                        setOpenTrip={setOpenTrip}
                    />
                </div>
                <AnimatePresence>
                    {openSearch && (
                        <motion.div
                            key="search"
                            className="search-container relative h-full md:h-screen z-[1001] md:z-0"
                            variants={animationSettings}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Search
                                positions={positions}
                                valueLocation={valueLocation}
                                valueName={valueName}
                                setValueLocation={setValueLocation}
                                setValueName={setValueName}
                                setZoomLocationX={setZoomLocationX}
                                setZoomLocationY={setZoomLocationY}
                                setSelectedPosition={setSelectedPosition}
                                setOpenPlaceCard={setOpenPlaceCard}
                            />
                            {openPlaceCard && (
                                <PlaceCard
                                    positions={positions}
                                    selectedPosition={selectedPosition}
                                    setOpenPlaceCard={setOpenPlaceCard}
                                    datesStorage={datesStorage}
                                    updateDatesStorage={updateDatesStorage}
                                    setRouteBlocked={setRouteBlocked}
                                    dates={dates}
                                    setDates={setDates}
                                />
                            )}
                        </motion.div>
                    )}
                    {openTrip && (
                        <motion.div
                            key="trip"
                            className="trip-container relative h-full md:h-screen z-[1001] md:z-0"
                            variants={animationSettings}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Trip
                                positions={positions}
                                datesStorage={datesStorage}
                                showRoute={showRoute}
                                setShowRoute={setShowRoute}
                                routingControl={routingControl}
                                setRoutingControl={setRoutingControl}
                                transportMode={transportMode}
                                setTransportMode={setTransportMode}
                                sortedDates={sortedDates}
                                setSortedDates={setSortedDates}
                                routeBlocked={routeBlocked}
                                setRouteBlocked={setRouteBlocked}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="md:relative flex-grow h-full">
                    <Map
                        setOpenSearch={setOpenSearch}
                        positions={positions}
                        zoomLocationX={zoomLocationX}
                        zoomLocationY={zoomLocationY}
                        setZoomLocationX={setZoomLocationX}
                        setZoomLocationY={setZoomLocationY}
                        setSelectedPosition={setSelectedPosition}
                        setOpenPlaceCard={setOpenPlaceCard}
                        setOpenTrip={setOpenTrip}
                    />
                    <DarkModeBtn />
                </div>
            </div>
            <div className="md:hidden">
                <Navbar
                    openSearch={openSearch}
                    setOpenSearch={setOpenSearch}
                    setOpenPlaceCard={setOpenPlaceCard}
                    openTrip={openTrip}
                    setOpenTrip={setOpenTrip}
                />
            </div>
        </div>
    );
}
