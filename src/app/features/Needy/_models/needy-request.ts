export interface NeedRequest {
    iD: number ;
    ssn: string ;
    firstName: string ;
    lastName: string ;
    age: number ;
    bloodType: string ;
    gender: string ;
    phone: string ;
    location: string ;
    hospitalReport: File | null;
    quantity: number ;
    date: string ;
    longitude: number ;
    latitude: number ;
    sectionId: number ;
    applicationUserId: string ;
}