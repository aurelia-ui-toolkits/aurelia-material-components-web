import defaultHtml from '!!raw-loader!./default/default.html?raw';
import filterHtml from '!!raw-loader!./filter/filter.html?raw';
import inputHtml from '!!raw-loader!./input/input.html?raw';
import filterBindingHtml from '!!raw-loader!./filter-binding/filter-binding.html?raw';
import filterBindingCode from '!!raw-loader!./filter-binding/filter-binding';

import { Default } from './default/default';
import { Filter } from './filter/filter';
import { Input } from './input/input';
import { FilterBinding } from './filter-binding/filter-binding';

export class ChipsExamples {
  defaultHtml = defaultHtml;
  filterHtml = filterHtml;
  inputHtml = inputHtml;
  filterBindingHtml = filterBindingHtml;
  filterBindingCode = filterBindingCode;

  default = Default;
  filter = Filter;
  input = Input;
  filterBinding = FilterBinding;
}
