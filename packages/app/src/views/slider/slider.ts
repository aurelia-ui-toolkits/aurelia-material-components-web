import template from '../component-viewer/component-viewer.html';
import { customElement } from 'aurelia';
import { routes } from 'aurelia-direct-router';
import { ComponentViewer } from '../component-viewer/component-viewer';
import { SliderExamples } from './slider-examples';
import { ApiViewer } from '../api-viewer/api-viewer';

@customElement({ name: 'slider', template })
@routes([    // { path: '', redirectTo: 'examples' },
    { id: 'examples', path: 'examples', title: 'Examples', component: SliderExamples },
    { id: 'api', path: 'api', title: 'Api', component: ApiViewer }
])
export class Slider extends ComponentViewer { }
