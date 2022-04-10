import { FormValidator } from "../../utils/FormValidator";
import { Block, BlockConfig } from "./Block";
import '../../styles/layouts/base/styles.scss';
import '../../styles/layouts/form/styles.scss';


export class FormBlock extends Block{
    public validator: FormValidator;
   
    constructor(config: BlockConfig){
        super(config);
    }
}