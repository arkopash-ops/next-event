export interface Event {
    id: string;
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    start_time: string;
    end_time: string;
}

export interface EventFormData {
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    start_time: string;
    end_time: string;
}
