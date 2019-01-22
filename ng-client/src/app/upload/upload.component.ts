import { Component, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { UploaderOptions, UploadFile, UploadInput, UploadOutput } from "ngx-uploader";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"]
})
export class UploadComponent {
  @ViewChild("uploader") uploaderInput: ElementRef;

  options: UploaderOptions = {
    concurrency: 1,
    // TODO: add line if only one file is needed at a time
    // maxUploads: 1,
    allowedContentTypes: [
      "application/excel",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/x-excel",
      "application/x-msexcel",
      "application/xml",
      "text/xml",
      "text/csv",
      "text/tab-separated-values"
    ]
  };
  uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  files: UploadFile[] = [];
  dragOver: boolean;

  constructor(private http: HttpClient) {}

  onUploadOutput(output: UploadOutput): void {
    if (output.type === "allAddedToQueue") {
      // TODO: add if uploading one file when added
      // const event: UploadInput = {
      //   type: "uploadAll",
      //   url: "/upload",
      //   method: "POST"
      // };
      this.removeSelectedFile();
      // this.uploadInput.emit(event);
    } else if (output.type === "addedToQueue" && typeof output.file !== "undefined") {
      this.files.push(output.file);
      this.removeSelectedFile();
    } else if (output.type === "uploading" && typeof output.file !== "undefined") {
      const index = this.files.findIndex(file => typeof output.file !== "undefined" && file.id === output.file.id);
      this.files[index] = output.file;
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === "dragOver") {
      this.dragOver = true;
    } else if (output.type === "dragOut") {
      this.dragOver = false;
    } else if (output.type === "drop") {
      this.dragOver = false;
    } else if (output.type === "done" && output.file) {
      if (output.file.responseStatus === 200) {
        console.log("File is uploaded.", output.file.id);
      } else if (output.file.responseStatus >= 400) {
        console.log("Error while uploading file.");
      }
    } else if (output.type === "rejected") {
      console.log("File is rejected.");
    } else if (output.type === "removed") {
      const index = this.files.findIndex(file => typeof output.file !== "undefined" && file.id === output.file.id);
      this.files.splice(index, 1);
    } else if (output.type === "removedAll") {
      this.files = [];
    }
  }

  uploadAll() {
    const event: UploadInput = {
      type: "uploadAll",
      url: "/upload",
      method: "POST"
    };
    this.removeSelectedFile();
    this.uploadInput.emit(event);
  }

  upload(file) {
    this.removeSelectedFile();
    this.uploadInput.emit({ type: "uploadFile", url: "/upload", method: "POST", file: file });
  }

  cancelUpload(id: string) {
    this.removeSelectedFile();
    this.uploadInput.emit({ type: "cancel", id: id });
  }

  remove(file) {
    this.removeSelectedFile();
    this.uploadInput.emit({ type: "remove", id: file.id });
  }

  removeAll() {
    this.removeSelectedFile();
    this.uploadInput.emit({ type: "removeAll" });
  }

  private removeSelectedFile() {
    this.uploaderInput.nativeElement.value = "";
  }
}
