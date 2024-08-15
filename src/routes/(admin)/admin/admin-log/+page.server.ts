
export type Packageactive ={
    Id : number;
    Name : string
    Price : number
    QuotaLimit : number
    CreatedAt : Date
    UpdatedAt : Date
    Status : string
} 




export type Logdata = {
    Id : number ;
    Timestamp : Date;
    Action : string;
    MethodName : string;
    SqlData : string;
    ActorName : string;
}