import { createApp, h, ref } from 'vue';
import { ElDialog, ElButton } from 'element-plus';
import { isFunction } from '~/utils/tools';

export default function lwDialog(componet, props, DialogProps) {
  const modal = ref(true);
  const instnce = ref();

  const footerSlot = DialogProps.footer;

  if (!footerSlot) {
    DialogProps.footer = () => [
      h(
        ElButton,
        {
          type: 'primary',
          onClick: () => {
            console.log('123213', instnce.value);
          },
        },
        '确定',
      ),
      h(
        ElButton,
        {
          onClick: () => {
            console.log('123213', instnce.value);
          },
        },
        '取消',
      ),
    ];
  }

  const dialog = () =>
    h(
      ElDialog,
      {
        ...DialogProps,
        modelValue: modal.value,
        onClosed() {
          close();
        },
        onConfirm() {
          console.log('onConfirm');
        },
      },
      {
        default: () => h(componet, { ref: instnce, ...props }),
        // footer: () =>
        //   h(
        //     ElButton,
        //     {
        //       type: 'primary',
        //       onClick: () => {
        //         console.log('123213', instnce.value);
        //       },
        //     },
        //     '确定',
        //   ),
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

  return {
    close,
  };
}

// function buildFooter(footerSlot: any, instnce: any) {
//   if (!footerSlot) {
//     return () => h(ElButton, {
//       type: 'primary',
//       onClick: () => {
//         console.log('123213', instnce.value);
//       },
//     }, '确定', '取消');
//   }

//   if (isFunction(footerSlot)) {
//     return footerSlot;
//   }

//   return h(ElButton, {
//     type: 'primary',
//     onClick: () => {
//       console.log('123213', instnce.value);
//     },
//   }, '确定');
// }
