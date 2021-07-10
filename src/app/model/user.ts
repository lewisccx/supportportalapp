import { Role } from './role';
export class User {

   
    private userOid :number

    public nric: string;
    public staffId: string;
    public name: string;
    public salutation: string;
    public userInitial: string;
   
    public contactNo: string;
    public contactExt: string;
    public faxNo: string;
    public email: string;
    public dteLastLogin: string;
    public dteLastLogout: string;
    public dteExpire: string;
    public displayName: string;
    public appt: string;
    public locked: Boolean;
    public roleSet: Role[];
    constructor(){
        this.userOid = 0;
        this.nric = '';
        this.staffId = '';
        this.name ='';
        this.salutation = '';
        this.userInitial = '';
        this.contactNo = '';
        this.contactExt = '';
        this.faxNo = '';
        this.email = '';
        this.dteLastLogin = '';
        this.dteLastLogout = '';
        this.dteExpire = '';
        this.displayName = '';
        this.appt = '';
        this.locked = false;
        this.roleSet = [];
    }

}