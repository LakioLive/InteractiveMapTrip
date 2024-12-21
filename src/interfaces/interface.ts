export interface IDates {
    id: number;
    date: string;
    active: boolean;
}

export interface IDatesStorage {
    [key: number]: IDates[];
}

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

export interface ISortedDates {
    date: string;
    places: IPositions[];
}
