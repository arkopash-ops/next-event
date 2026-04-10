export interface Shows {
    id: string;
    event_id: string;
    show_time: string;
    total_seats: number;
    available_seats: number;
    price: string;
}


export interface ShowForm {
    show_time: string;
    total_seats: string;
    price: string;
}
