import './BasicLayout.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import { omit } from 'lodash';
import { WithFalse, MenuDataItem } from '@/typing';
import RouteContext from '@/utils/RouteContext';
import AppMain from './AppMain';
import Siderbar, { SiderbarProps } from './Siderbar';
import defaultSetting from './defaultSettings';

export type BasicLayoutProps = SiderbarProps & {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
  logo?: React.ReactNode;
  collapsed?: boolean;
  siderWidth?: number;
  onCollapse?: WithFalse<(collapsed?: boolean) => void>;
  footerRender?: WithFalse<
    (props: any, defaultDom: React.ReactNode) => React.ReactNode
  >;
  menuDataRender?: (data: MenuDataItem[]) => MenuDataItem[];
  isMobile?: boolean;
  fixSiderbar?: boolean;
};

const renderSiderbar = (props: BasicLayoutProps): React.ReactNode => {
  return <Siderbar {...props} />;
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    style,
    prefixCls,
    isMobile,
    collapsed,
    siderWidth,
    contentStyle,
    onCollapse,
    ...rest
  } = props;

  const menuData = [] as MenuDataItem[];

  const defaultProps = omit(
    {
      ...props,
    },
    ['className', 'style'],
  );

  const siderbarDom = renderSiderbar({
    ...defaultProps,
    menuData,
    isMobile,
    collapsed,
    onCollapse,
    theme: 'dark',
  });

  const basicClassName = `${prefixCls}-basicLayout`;
  const className = classnames(props.className, basicClassName, {
    [`${basicClassName}-mobile`]: isMobile,
  });

  const contextClassName = classnames(`${basicClassName}-content`, {
    //
  });

  return (
    <RouteContext.Provider
      value={{
        prefixCls,
        isMobile,
        collapsed,
        siderWidth,
        menuData,
      }}
    >
      <div className={className}>
        <Layout
          style={{
            minHeight: '100%',
            ...style,
          }}
          hasSider
        >
          {siderbarDom}
          <Layout>
            <div>headerMenuDom</div>
            <AppMain
              {...rest}
              className={contextClassName}
              style={contentStyle}
            >
              {props.children}
            </AppMain>
            <div>footerDom</div>
          </Layout>
        </Layout>
      </div>
    </RouteContext.Provider>
  );
};

BasicLayout.defaultProps = {
  ...defaultSetting,
  logo: './favicon.png',
  prefixCls: 'az',
  siderWidth: 208,
};

export default BasicLayout;
