import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import {CategoryService} from '../../shared/services/categories.service'
@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') inputRef!: ElementRef
  form!: FormGroup
  image!: File
  imagePreview:any 
  isNew = true
  constructor(private route: ActivatedRoute,
              private categoriesService: CategoryService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null,Validators.required)
    })

    this.form.disable()
    this.route.params
      .pipe(
        switchMap(
          (params: Params)=>{
            if(params['id']){
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }
            return of(null)
          }
        )
      )
      .subscribe(category => {
        if(category){
          this.form.patchValue({
            name: category.name
          })
          MaterialService.updateTextInputs()
        }
        this.form.enable()
      },
      error => MaterialService.toast(error.error.message)
      )
  }

  triggerClick(){
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any){
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = ()=>{
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit(){

  }
}
