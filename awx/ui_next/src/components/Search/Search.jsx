import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import {
  Button as PFButton,
  Dropdown as PFDropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  Form,
  FormGroup,
  TextInput as PFTextInput,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

import styled from 'styled-components';

const TextInput = styled(PFTextInput)`
  min-height: 0px;
  height: 30px;
`;

const Button = styled(PFButton)`
  width: 34px;
  padding: 0px;
`;

const Dropdown = styled(PFDropdown)`
  &&& {
    /* Higher specificity required because we are selecting unclassed elements */
    > button {
      min-height: 30px;
      min-width: 70px;
      height: 30px;
      padding: 0 10px;
      margin: 0px;

      > span {
        /* text element */
        width: auto;
      }

      > svg {
        /* caret icon */
        margin: 0px;
        padding-top: 3px;
        padding-left: 3px;
      }
    }
  }
`;

const NoOptionDropdown = styled.div`
  align-self: stretch;
  border: 1px solid grey;
  padding: 3px 7px;
  white-space: nowrap;
`;

const InputFormGroup = styled(FormGroup)`
  flex: 1;
`;

class Search extends React.Component {
  constructor(props) {
    super(props);

    const { sortedColumnKey } = this.props;
    this.state = {
      isSearchDropdownOpen: false,
      searchKey: sortedColumnKey,
      searchValue: '',
    };

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleDropdownToggle(isSearchDropdownOpen) {
    this.setState({ isSearchDropdownOpen });
  }

  handleDropdownSelect({ target }) {
    const { columns } = this.props;
    const { innerText } = target;

    const { key: searchKey } = columns.find(({ name }) => name === innerText);
    this.setState({ isSearchDropdownOpen: false, searchKey });
  }

  handleSearch(e) {
    // keeps page from fully reloading
    e.preventDefault();

    const { searchKey, searchValue } = this.state;
    const { onSearch } = this.props;

    // TODO: probably not _always_ add icontains.  I don't think icontains works for numbers.
    onSearch(`${searchKey}__icontains`, searchValue);

    this.setState({ searchValue: '' });
  }

  handleSearchInputChange(searchValue) {
    this.setState({ searchValue });
  }

  render() {
    const { up } = DropdownPosition;
    const { columns, i18n } = this.props;
    const { isSearchDropdownOpen, searchKey, searchValue } = this.state;
    const { name: searchColumnName } = columns.find(
      ({ key }) => key === searchKey
    );

    const searchDropdownItems = columns
      .filter(({ key, isSearchable }) => isSearchable && key !== searchKey)
      .map(({ key, name }) => (
        <DropdownItem key={key} component="button">
          {name}
        </DropdownItem>
      ));

    return (
      <Form autoComplete="off">
        <div className="pf-c-input-group">
          {searchDropdownItems.length > 0 ? (
            <FormGroup
              fieldId="searchKeyDropdown"
              label={
                <span className="pf-screen-reader">
                  {i18n._(t`Search key dropdown`)}
                </span>
              }
            >
              <Dropdown
                onToggle={this.handleDropdownToggle}
                onSelect={this.handleDropdownSelect}
                direction={up}
                isOpen={isSearchDropdownOpen}
                toggle={
                  <DropdownToggle
                    id="awx-search"
                    onToggle={this.handleDropdownToggle}
                  >
                    {searchColumnName}
                  </DropdownToggle>
                }
                dropdownItems={searchDropdownItems}
              />
            </FormGroup>
          ) : (
            <NoOptionDropdown>{searchColumnName}</NoOptionDropdown>
          )}
          <InputFormGroup
            fieldId="searchValueTextInput"
            label={
              <span className="pf-screen-reader">
                {i18n._(t`Search value text input`)}
              </span>
            }
            style={{ width: '100%' }}
            suppressClassNameWarning
          >
            <TextInput
              type="search"
              aria-label={i18n._(t`Search text input`)}
              value={searchValue}
              onChange={this.handleSearchInputChange}
              style={{ height: '30px' }}
            />
          </InputFormGroup>
          <Button
            variant="tertiary"
            type="submit"
            aria-label={i18n._(t`Search submit button`)}
            onClick={this.handleSearch}
          >
            <SearchIcon />
          </Button>
        </div>
      </Form>
    );
  }
}

Search.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSearch: PropTypes.func,
  sortedColumnKey: PropTypes.string,
};

Search.defaultProps = {
  onSearch: null,
  sortedColumnKey: 'name',
};

export default withI18n()(Search);
