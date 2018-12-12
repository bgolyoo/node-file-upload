import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { UploadComponent } from "./upload.component";
import { NgxUploaderModule } from "ngx-uploader";

@NgModule({
  declarations: [UploadComponent],
  exports: [UploadComponent],
  imports: [CommonModule, HttpClientModule, NgxUploaderModule]
})
export class UploadModule {}
