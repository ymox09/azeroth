import { useEffect, ReactText } from 'react';
import { TablePaginationConfig } from 'antd/lib/table';
import { UseReqeustTableAction, ResponseData } from '@/utils/hooks/useRequestTable';
import { CoreTableActionType } from '@/typing';
import { CounterType } from './container';
import { TableProps } from './Table';

/**
 * 将counter和ref进行绑定，暴露几个业务方法
 * @param ref
 * @param counter
 * @param onCleanSelected
 */
export const useAction = <T, U = any>(
  ref: TableProps<T, any>['actionRef'],
  counter: ReturnType<CounterType>,
  onCleanSelected: () => void,
) => {
  useEffect(() => {
    const userAction: CoreTableActionType = {
      reload: async resetPage => {
        const {
          action: { current },
        } = counter;
        if (resetPage) {
          await current?.resetPage();
        }
        await current?.reload();
      },
      reloadAndRest: async () => {
        const {
          action: { current },
        } = counter;
        onCleanSelected();
        await current?.resetPage();
        await current?.reload();
      },
      rest: async () => {
        const {
          action: { current },
        } = counter;
        await current?.reset();
        await current?.reload();
      },
      cleanSelected: () => onCleanSelected(),
    };
    if (ref && typeof ref === 'function') {
      ref(userAction);
    }
    if (ref && typeof ref !== 'function') {
      ref.current = userAction;
    }
  }, []);
};

/**
 * @param pagination 默认分页设置
 * @param action UseReqeustTableAction 函数
 * @param intl 未实现
 */
export const mergePagination = <T>(
  pagination: TablePaginationConfig | boolean | undefined = {},
  action: UseReqeustTableAction<ResponseData<T>>,
  intl?: any,
): TablePaginationConfig | false | undefined => {
  if (pagination === false) {
    return false;
  }
  const defaultPagination: TablePaginationConfig | {} = typeof pagination === 'object' ? pagination : {};
  const { current, pageSize } = action;

  return {
    showTotal: (all, range) => {
      return `第 ${range[0]}-${range[1]} 条/总共 ${all} 条`;
    },
    showSizeChanger: true,
    total: action.total,
    ...defaultPagination,
    current,
    pageSize,
    onChange: (newPage, newPageSize) => {
      if (current !== newPage || pageSize !== newPageSize) {
        action.setPageInfo({ pageSize, page: newPage });
      }

      const { onChange } = pagination as TablePaginationConfig;
      if (onChange) {
        onChange(newPage, pageSize || 20);
      }
    },
  };
};

export const getColumnKey = (key?: ReactText, index?: number): string => {
  if (key) {
    return `${key}`;
  }
  return `${index}`;
};

/**
 * 延迟请求 - 调试
 * @param value
 * @param time
 */
export const dealyPromise = (value: any, time: number = 3000): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });
};
