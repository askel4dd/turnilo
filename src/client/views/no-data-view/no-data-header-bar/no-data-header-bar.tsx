/*
 * Copyright 2015-2016 Imply Data, Inc.
 * Copyright 2017-2018 Allegro.pl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { Customization } from "../../../../common/models/customization/customization";
import { Fn } from "../../../../common/utils/general/general";
import { SvgIcon } from "../../../components/svg-icon/svg-icon";
import "./no-data-header-bar.scss";

export interface NoDataHeaderBarProps {
  onNavClick: Fn;
  customization?: Customization;
  title?: string;
}

export interface NoDataHeaderBarState {
  userMenuOpenOn?: Element;
}

export class NoDataHeaderBar extends React.Component<NoDataHeaderBarProps, NoDataHeaderBarState> {
  constructor(props: NoDataHeaderBarProps) {
    super(props);
    this.state = {
      userMenuOpenOn: null
    };
  }

  render() {
    const { onNavClick, customization, title } = this.props;

    let headerStyle: any = null;
    if (customization && customization.headerBackground) {
      headerStyle = {
        background: customization.headerBackground
      };
    }

    return <header className="no-data-header-bar" style={headerStyle}>
      <div className="left-bar" onClick={onNavClick}>
        <div className="menu-icon">
          <SvgIcon svg={require("../../../icons/menu.svg")} />
        </div>
        <div className="title">{title}</div>
      </div>
      <div className="right-bar">
        {this.props.children}
      </div>
    </header>;
  }
}
