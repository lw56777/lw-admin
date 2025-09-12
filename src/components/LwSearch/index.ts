import { type ComponentInstance } from 'vue';
import { ElButton, ElCard } from 'element-plus';

export type TProps = ComponentInstance<typeof ElCard>;

export type TEmitsAttrs = Partial<ComponentInstance<typeof ElButton>> & {
  name: string;
  onClick: () => void;
};

export type TEmits = {
  search: () => void;
  reset: () => void;
  refresh: () => void;
};
