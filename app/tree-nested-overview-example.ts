import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import TREE_DATA  from './po.json';
/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

/**
 * The Json tree data in string. The data could be parsed into Json object
 */
// });
const TREE_DATA1 = JSON.stringify({
  "data": {
    "parennt_1": [
      {
        "child_1": [
          {
            "subchile_1": [
              "product_1",
              "Product_2",             
            ]
          },
          {
            "subchile_2": [
              "product_3",
              "product_4",           
            ]
          },
          {
            "subchile_3": [
              "product_4",
              "product_5",           
            ]
            }
         ],
        "child_2": [
          {
            "subchile_4": [
              "product_14",
              "Product_25",             
            ]
          },
          {
            "subchile_5": [
              "product_3y",
              "product_4v",           
            ]
          },
          {
            "subchile_6": [
              "product_4y",
              "product_5v",           
            ]
            }
         ]
      }
   ],

   "parennt_2": [
      {
        "child_11": [
          {
            "subchild_11": [
              "product_11",
              "Product_21",             
            ]
          },
          {
            "subchile_21": [
              "product_31",
              "product_41",           
            ]
          },
          {
            "subchile_31": [
              "product_41",
              "product_51",           
            ]
            }
         ],
          "child_31": [
          {
            "subchild_141": [
              "product_171",
              "Product_216",             
            ]
          },
          {
            "subchile_21": [
              "product_319",
              "product_415",           
            ]
          },
          {
            "subchile_31": [
              "product_461",
              "product_551",           
            ]
            }
         ]
      }
   ],
  }    
})
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA)[0];

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'tree-nested-overview-example',
  templateUrl: 'tree-nested-overview-example.html',
  styleUrls: ['tree-nested-overview-example.css'],
  providers: [FileDatabase]
})
export class TreeNestedOverviewExample {
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  constructor(database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */