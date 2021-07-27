import { User } from "./user";

export class pageUser {

    public payload: User[];
public currentPage: number;
public totalItems: number;
public totalPage: number;
constructor(){
    this.payload = []
    this.currentPage = 0
    this.totalItems = 0
    this.totalPage  =0;
}

}