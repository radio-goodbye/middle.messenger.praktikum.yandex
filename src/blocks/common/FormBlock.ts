import { FormValidator } from "../../utils/FormValidator";
import { Block, BlockConfig } from "./Block";

export class FormBlock extends Block{
    public validator: FormValidator;
   
    constructor(config: BlockConfig){
        super(config);
    }
}