import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { MdDirectionsBike, MdError } from "react-icons/md";
import { FaCar, FaWalking, FaInfoCircle } from "react-icons/fa";
import L from "leaflet";
import "leaflet-routing-machine";
import {
    IDatesMap,
    IDatesStorage,
    IPositions,
    IRouteSegments,
    ISortedDates,
} from "../../interfaces/trip/interface";
import PlaceCardForNavigation from "./placeCardForNavigation/PlaceCardForNavigation";
import RouteInfo from "./routeInfo/RouteInfo";

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

interface TripProps {
    positions: IPositions[];
    datesStorage: IDatesStorage;
    showRoute: boolean;
    setShowRoute: Dispatch<SetStateAction<boolean>>;
    routingControl: L.Routing.Control | null;
    setRoutingControl: Dispatch<SetStateAction<L.Routing.Control | null>>;
    transportMode: string;
    setTransportMode: Dispatch<SetStateAction<string>>;
    sortedDates: ISortedDates[];
    setSortedDates: Dispatch<SetStateAction<ISortedDates[]>>;
    routeBlocked: boolean;
    setRouteBlocked: Dispatch<SetStateAction<boolean>>;
}

export default function Trip({
    positions,
    datesStorage,
    showRoute,
    setShowRoute,
    routingControl,
    setRoutingControl,
    transportMode,
    setTransportMode,
    sortedDates,
    setSortedDates,
    routeBlocked,
    setRouteBlocked,
}: TripProps) {
    const [isRoute, setIsRoute] = useState<string | null>(null);
    const [routeSegments, setRouteSegments] = useState<IRouteSegments[]>([]);
    const [routeTime, setRouteTime] = useState<string[]>([]);
    const [routeDistance, setRouteDistance] = useState<string[]>([]);

    useEffect(() => {
        const datesMap: IDatesMap = {};

        Object.keys(datesStorage).forEach((positionId) => {
            const dates = datesStorage[+positionId];
            dates.forEach((dateObj) => {
                if (dateObj.active) {
                    if (!datesMap[dateObj.date]) {
                        datesMap[dateObj.date] = [];
                    }

                    datesMap[dateObj.date].push(positions[+positionId]);
                }
            });
        });

        const sortedDatesArray = Object.keys(datesMap)
            .sort((a, b) => {
                const [dayA, monthA] = a.split("/").map(Number);
                const [dayB, monthB] = b.split("/").map(Number);
                return (
                    new Date(2024, monthA - 1, dayA).getTime() -
                    new Date(2024, monthB - 1, dayB).getTime()
                );
            })
            .map((date) => ({ date, places: datesMap[date] }));

        setSortedDates(sortedDatesArray);
    }, [datesStorage, positions, setSortedDates]);

    const handleNavigation = async (places: IPositions[], date: string) => {
        setIsRoute(null);
        setRouteSegments([]);
        setRouteBlocked(false);

        if (showRoute && routingControl) {
            routingControl.remove();
            setRoutingControl(null);
            setShowRoute(false);
            return;
        }

        if (places.length < 2) return;

        const waypoints = places.map((place) => L.latLng(place.x, place.y));
        const profile =
            transportMode === "car"
                ? "driving"
                : transportMode === "bike"
                  ? "cycling"
                  : "walking";

        const newRoutingControl = L.Routing.control({
            waypoints,
            lineOptions: {
                styles: [{ color: "#6FA1EC", weight: 4 }],
                extendToWaypoints: false,
                missingRouteTolerance: 0,
            },
            // createMarker: () => null,
            routeWhileDragging: false,
            addWaypoints: false,
            router: L.Routing.mapbox(
                "pk.eyJ1IjoicGFwb2I2NTE2MyIsImEiOiJjbHdvc2ZjeXowNmEzMmxwMXl2bWp0bG9lIn0.rjsesOn8yBOT8uQN4wYI8w",
                {
                    profile: `mapbox/${profile}`,
                },
            ),
        });

        newRoutingControl.on("routesfound", (e) => {
            const route = e.routes[0];
            const totalDistance = (route.summary.totalDistance / 1000).toFixed(
                2,
            );
            const totalTime = (route.summary.totalTime / 3600).toFixed(2);
            const currentTime =
                new Date().getHours() + Number("0." + new Date().getMinutes());

            if (parseFloat(totalTime) + currentTime > 24) {
                setRouteBlocked(true);
                newRoutingControl.remove();
                setRoutingControl(null);
                setShowRoute(false);
                return false;
            }

            let distanceInstructions = 0;
            let timeInstructions = 0;
            const resultDistanceInstructions = [];
            const resultTimeInstructions = [];

            setRouteTime([]);
            setRouteDistance([]);

            route.instructions.forEach(
                (obj: { time: number; distance: number; type: string }) => {
                    timeInstructions += obj.time;
                    distanceInstructions += obj.distance;

                    if (obj.type === "WaypointReached") {
                        resultDistanceInstructions.push(
                            (distanceInstructions / 1000).toFixed(2),
                        );
                        resultTimeInstructions.push(
                            convertTime(timeInstructions),
                        );

                        distanceInstructions = 0;
                        timeInstructions = 0;
                    }
                },
            );

            resultDistanceInstructions.push(
                (distanceInstructions / 1000).toFixed(2),
            );
            resultTimeInstructions.push(convertTime(timeInstructions));

            console.log(resultDistanceInstructions);

            setRouteTime(resultTimeInstructions);
            setRouteDistance(resultDistanceInstructions);
            setRouteSegments([{ distance: totalDistance, time: totalTime }]);
            setShowRoute(true);
        });

        if (!routeBlocked) {
            await newRoutingControl.addTo(window.map);
        }

        setIsRoute(date);

        setRoutingControl(newRoutingControl);
        window.map.fitBounds(L.latLngBounds(waypoints));
    };

    const convertTime = (totalSeconds: number): string => {
        const totalMinutes = totalSeconds / 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return `${hours}.${minutes.toString().padStart(2, "0")}`;
    };

    return (
        <div className="trip absolute flex flex-col w-screen md:w-full h-full pt-6 px-3 bg-white dark:bg-second-black z-[1999] transition-colors duration-700">
            <h1 className="mb-3 dark:text-white text-2xl sm:text-3xl font-bold">
                Trip Plan
            </h1>
            <div className="transport-modes grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                <motion.button
                    type="button"
                    className={`btn-global ${
                        transportMode === "car" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("car")}
                    variants={animationVariants}
                    whileTap="whileTap"
                >
                    <FaCar />
                </motion.button>
                <motion.button
                    type="button"
                    className={`btn-global ${
                        transportMode === "bike" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("bike")}
                    variants={animationVariants}
                    whileTap="whileTap"
                >
                    <MdDirectionsBike />
                </motion.button>
                <motion.button
                    type="button"
                    className={`btn-global ${
                        transportMode === "walk" ? "bg-blue-800" : ""
                    }`}
                    onClick={() => setTransportMode("walk")}
                    variants={animationVariants}
                    whileTap="whileTap"
                >
                    <FaWalking />
                </motion.button>
            </div>
            <div className="cards-place grid justify-items-center overflow-x-hidden overflow-y-scroll">
                {sortedDates.length ? (
                    sortedDates.map(({ date, places }, index) => (
                        <div key={index}>
                            <h2 className="mb-2 dark:text-white text-xl font-semibold transition-colors duration-700">
                                {date}
                            </h2>
                            {places.map((place, index) => (
                                <div key={index}>
                                    <PlaceCardForNavigation
                                        place={place}
                                        convertTime={convertTime}
                                    />
                                    {routeSegments.length > 0 &&
                                        index !== places.length - 1 && (
                                            <RouteInfo
                                                index={index}
                                                routeDistance={routeDistance}
                                                routeTime={routeTime}
                                            />
                                        )}
                                </div>
                            ))}
                            <div className="btn-navigation flex mt-3">
                                <motion.button
                                    type="button"
                                    className="btn-global"
                                    onClick={() =>
                                        handleNavigation(places, date)
                                    }
                                    disabled={routeBlocked}
                                    variants={animationVariants}
                                    whileTap="whileTap"
                                >
                                    Navigation
                                </motion.button>
                                {routeBlocked ? (
                                    <p className="msg-info_trip">
                                        <MdError className="text-red-500 text-2xl" />
                                        Route exceeds the 24-hour time limit
                                    </p>
                                ) : null}
                                {isRoute === date && !routeBlocked ? (
                                    <p className="msg-info_trip">
                                        <FaInfoCircle className="text-blue-800 text-2xl" />
                                        Route has been planned
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="date-section mb-4">
                        <h1 className="mb-2 dark:text-white text-2xl font-semibold transition-colors duration-700">
                            Add places for the trip
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
}
