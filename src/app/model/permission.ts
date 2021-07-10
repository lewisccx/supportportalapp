import { ThrowStmt } from "@angular/compiler";

export class Permission {
    private permissionOid: number;
    private module: string; 
    private url: string; 
    private action: string; 

    constructor(){
        this.permissionOid = 0;
        this.module = '';
        this.url = '';
        this.action = '';
    }
}
