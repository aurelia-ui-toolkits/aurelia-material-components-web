import template from '../component-viewer/component-viewer.html?raw';
import { customElement } from 'aurelia';
import { routes } from '@aurelia/router';
import { ComponentViewer } from '../component-viewer/component-viewer';
import { ImageListExamples } from './image-list-examples';
import { ApiViewer } from '../api-viewer/api-viewer';

@customElement({ name: 'image-list', template })
@routes([    // { path: '', redirectTo: 'examples' },
    { id: 'examples', path: 'examples', title: 'Examples', component: ImageListExamples },
    { id: 'api', path: 'api', title: 'Api', component: ApiViewer }
])
export class ImageList extends ComponentViewer { }
