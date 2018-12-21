import {LitElement, html} from '../../../dependencies/lit-element/lit-element.js';
import Boxes from '../../helpers/Boxes.js';
import shipCalcFormStyle from './shipCalcFormStyles';
class ShipCalcForm extends LitElement {
    static get properties() {
        return {
          category: {type:String},
          totalPcs:{type:Number},
          currentSavedCategories:{type:Array}
        }
    }
    constructor(){
        super();
        this.category = null;
        this.totalPcs = 0;
        this.boxes = new Boxes();
    }
    render(){
        return html`
            <h4>Calculate UPS rates</h4>
            <form @submit=${(e)=>{e.preventDefault()}}>
                <label for="pcs_num_input">Total Pcs.</label>
                <input type="number" id="pcs_num_input" @input=${this.handleTotalPcsChange} .value=${this.totalPcs}>
                <br />
                <label for="cat_input">Select Category</label>
                <select id="cat_input" @change=${this.handleCategoryChange} .value=${this.category}>
                    <option value="">Select Category</option>
                    ${this.boxes.categories.map((style)=>{
                        return html`
                            <option ?disabled=${this.savedCategories.includes(style.category)} .title="${this.savedCategories.includes(style.category) ? 'Option Already Selected' : ''}" .value="${style.category}">${style.name}</option>
                        `;
                    })}
                </select>
                <button title="Add multiple categories to shipment" type="button" ?disabled=${this.category == '' || this.category == null || this.totalPcs < 1} class="btn btn-primary btn-sm" id="add_cat_btn" @click=${this.handleAddCategory}>Add Category</button>
            </form>
            <style>
                ${shipCalcFormStyle}
            </style>
            `;
    }
    handleCategoryChange(e){
        console.log(e.target.value.trim())
        if(e.target.value.trim() == '') {
            this.category = '';
        } else {
            this.category = e.target.value.trim();
        }
        this.setEstimates();
        this.dispatchEvent(new CustomEvent('categorySelected',{detail: this.category}));
        
    }
    handleTotalPcsChange(e){
        this.totalPcs = e.target.value;
        this.dispatchEvent(new CustomEvent("currentTotalPcs", {detail:this.totalPcs || 0}));
        this.setEstimates();  
    }
    handleAddCategory(){
        const newSavedCategories = [...this.savedCategories, this.category];
        this.dispatchEvent(new CustomEvent("addCategory", {detail:newSavedCategories}));
        this.category = "";
        this.totalPcs = 0;

    }
    setEstimates(){
        const calulatedBoxes = this.boxes.returnBoxes(this.category, this.totalPcs);
        if(this.category && this.totalPcs > 0) {
            this.dispatchEvent(new CustomEvent("updateBoxesArray",{detail:calulatedBoxes}));
        } else {
            this.dispatchEvent(new CustomEvent("clearBoxesArray"));
        }
    } 
}

customElements.define("calc-form", ShipCalcForm);