import {Component, OnInit} from '@angular/core';
import {TreeNodeModel} from "../model/TreeNodeModel";
import {AlertsService} from "angular-alert-module";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  htmlTreeData: SafeHtml;
  htmlTreeDisplay: boolean = false;
  selectedFile: File;

  constructor(private alerts: AlertsService, private sanitizer: DomSanitizer) {
  }

  /** This function is responsbile for reading the imported json file
   * it also calls two functions buildTree() and generateHtmlTree()
   */
  fileImported(event) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, "UTF-8");
    fileReader.onload = () => {
      this.htmlTreeDisplay = false;
      let arrayNames = JSON.parse(fileReader.result as string);
      let tree = this.buildTree(arrayNames);
      this.htmlTreeData = "";
      this.generateHtmlTree(tree);
      this.htmlTreeDisplay = true;
    };

    fileReader.onerror = error => {
      console.error(error);
      this.alerts.setMessage(error.type,'error');
    };
  }
 /** This function is responsible for building the tree structure
  * from the data from the json file. 
  */
  buildTree(arrayNames) {
    try{
      let tree: TreeNodeModel[] = [];
      let currentRoots = {};

      for (let element of arrayNames) {
        let namePair = element.split(" ");
        let parent_name = namePair[1];
        let child_name = namePair[0];

        let parentExists = true;
        let parent = this.findParent(parent_name, tree);
        if (!parent) {
          parent = new TreeNodeModel(parent_name);
          parentExists = false;
        }

        let child = new TreeNodeModel(child_name, parent);
        parent.addToChildren(child);

        //Checking if child node already exists among the roots
        if (child_name in currentRoots) {
          child = tree[currentRoots[child_name]];
          parent.replaceLastChild(child);
          tree.splice(currentRoots[child_name], 1);
          delete currentRoots[child_name];
        }

        if (!parentExists) {
          tree.push(parent);
          currentRoots[parent_name] = tree.length - 1;
        }
      }
      return tree;
    }catch (e) {
      this.alerts.setMessage(e,'error');
    }
  }
/**
 *  Function that is checking if parent node already exists in the tree
 */
  private findParent(parent_name, root: TreeNodeModel[]): TreeNodeModel {
    for (let node of root) {
      if (node.name == parent_name) {
        return node;
      } else if (node.children.length > 0) {
        return this.findParent(parent_name, node.children);
      }
    }
    return undefined;
  }
/** This function generates the html output showing family tree structure */
  private generateHtmlTree(tree: TreeNodeModel[]){
    for(let node of tree){
      this.htmlTreeData += '<ul>';
      this.htmlTreeData += `${node.name}</li>`;
      if(node.children.length > 0){
        this.generateHtmlTree(node.children);
      }
      this.htmlTreeData += '</ul>';
    }
  }

}
