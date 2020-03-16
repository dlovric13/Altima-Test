
export class TreeNodeModel {
  private _name = "";
  private _children: TreeNodeModel[] = [];
  private _parent: TreeNodeModel;

  constructor(name, parent=undefined) {
    this._name = name;
    this._parent = parent
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get children(): TreeNodeModel[] {
    return this._children;
  }

  set children(value: TreeNodeModel[]) {
    this._children = value;
  }


  get parent(): TreeNodeModel {
    return this._parent;
  }

  set parent(value: TreeNodeModel) {
    this._parent = value;
  }

  addToChildren(node: TreeNodeModel) {
    if(this.validateCyclicConsistency(node.name)){
      this._children.push(node);
    } else {
      throw "Cyclic error";
    }
  }

  validateCyclicConsistency(childName): boolean{
    if(this.name != childName){
      if(this.parent){
        return this.parent.validateCyclicConsistency(childName);
      }
      return true;
    }
    return false;
  }

  replaceLastChild(child:TreeNodeModel){
    this.children[this.children.length-1] = child;
  }

}
