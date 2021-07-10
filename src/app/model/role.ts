import { Permission } from "./permission";

export class Role {
    public roleOid: number;
    public  role: string;
    //public descr: string;
    private permissionSet?: Permission[]
    constructor(){
        this.roleOid = 0;
        this.role = '';
        //this.descr = '';
        this.permissionSet = [];
    }
}