import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  freshnessList = ['Brand new', 'Second hand', 'Refurbished'];
  productForm!: FormGroup;
  actionButton: string = 'Save';
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<ModalComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: [''],
      freshness: [''],
      price: [''],
      date: [''],
      comment: [''],
    });
    if (this.editData) {
      this.actionButton = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['price'].setValue(this.editData.price);
    } else {
      this.getProducts(this.productForm);
      this.api.getProduct().subscribe({
        complete: () => this.api.getProduct().subscribe(),
      });
    }
    console.log('Edit Data', this.editData);
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('Product added successfully');
          },
          error: (error) => {
            alert(`Error while adding a new product: ${error}`);
          },
          complete: () => {
            this.api.getProduct().subscribe();
          },
        });
      }
      console.log('finished POst');
    }
    // this.getProducts(this.productForm.value);
    this.api.getProduct().subscribe();
  }

  getProducts(data: any) {
    if (data) {
      this.api.getProduct().subscribe({
        next: () => {},
        error: (error) => {
          alert(error);
        },
        complete: () => {},
      });
    }
  }

  updateProduct() {
    this.api.updateProduct(this.productForm.value, this.editData.id).subscribe({
      next: () => {
        this.productForm.reset();
        this.dialogRef.close('updated');
      },
      error: (error) => {
        alert('Error while updating');
      },
    });
  }
}
