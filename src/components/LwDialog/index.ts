import { createApp, h, ref } from 'vue';
import type { VNode, Component } from 'vue';
import { ElDialog, ElButton } from 'element-plus';
import type { DialogProps, ButtonProps } from 'element-plus';
import { isString } from '~/utils/tools';

export type TDialogProps = Partial<DialogProps> & {
  footer?: (() => VNode) | (() => VNode[]) | Component;
};

type TFooterBtnProps = Partial<ButtonProps> & {
  name?: string; // 按钮名称
  hide?: boolean; // 是否执行完毕后关闭
  click?: string | (() => void); // 事件名称/点击事件
};

export function useLwDialog(
  componet: Component | (() => VNode),
  props: Record<string, any>,
  DialogProps: TDialogProps,
) {
  const modal = ref(true);
  const instnce = ref();

  const dialog = () =>
    h(
      ElDialog,
      {
        ...DialogProps,
        modelValue: modal.value,
      },
      {
        default: () => h(componet, { ref: instnce, ...props }),
        ...DialogProps,
      },
    );

  const app = createApp(dialog);
  const div = document.createElement('div');
  document.body.appendChild(div);
  app.mount(div);

  const close = () => {
    modal.value = false;
  };

  const createConfirm = (props?: string | TFooterBtnProps) => {
    const Component = {
      setup() {
        const _props = {
          name: '确认',
          hide: true,
          click: 'confirm',
          ...(isString(props) ? { name: props } : props),
        };
        const { name, hide, click } = _props;
        const loading = ref(false);

        const onClick = async () => {
          try {
            loading.value = true;

            if (isString(click)) {
              await instnce.value?.[click]?.();
            } else {
              await click?.();
            }

            hide && close();
          } catch (error) {
            throw error;
          } finally {
            loading.value = false;
          }
        };

        return () =>
          h(
            ElButton,
            {
              loading: loading.value,
              type: 'primary',
              onClick,
              ..._props,
            },
            name,
          );
      },
    };

    return h(Component);
  };

  const createCancel = (
    name: string = '取消',
    props?: Partial<ButtonProps>,
  ) => {
    return h(
      ElButton,
      { ...props, onClick: () => close() },
      {
        default: () => name,
      },
    );
  };

  return {
    close,
    createConfirm,
    createCancel,
  };
}
