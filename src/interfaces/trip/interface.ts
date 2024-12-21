export interface IPositions {
    id: number;
    name: string;
    location: string;
    category: string;
    img: string;
    x: number;
    y: number;
    time: number;
}

export interface IDates {
    id: number;
    date: string;
    active: boolean;
}

export interface IDatesStorage {
    [key: number]: IDates[];
}

export interface ISortedDates {
    date: string;
    places: IPositions[];
}

export interface IRouteSegments {
    distance: string;
    time: string;
}

export interface IDatesMap {
    [key: string]: IPositions[];
}
