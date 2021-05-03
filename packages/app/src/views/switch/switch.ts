import template from '../component-viewer/component-viewer.html';
import { customElement } from 'aurelia';
import { routes } from 'aurelia-direct-router';
import { ComponentViewer } from '../component-viewer/component-viewer';
import { SwitchExamples } from './switch-examples';
import { ApiViewer } from '../api-viewer/api-viewer';

@customElement({ name: 'switch', template })
@routes([    // { path: '', redirectTo: 'examples' },
  { id: 'examples', path: 'examples', title: 'Examples', component: SwitchExamples },
  { id: 'api', path: 'api', title: 'Api', component: ApiViewer }
])
export class Switch extends ComponentViewer { }
