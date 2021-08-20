import styled, { css } from 'styled-components';

const StyledFiltersWrapper = styled.div`
  padding: 16px 0;
  white-space: nowrap;
  width: 100%;
  overflow: auto;
`;

const StyledFilterItem = styled.div(({ theme }) => css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  padding: 2px;
  cursor: pointer;
  border-radius: 2px;
  ${(props) => props.active && `
    background-color: ${theme.palette['bg-primary-active']};
    color: ${theme.palette['txt-primary-invert']};
  `};
`);

const FilterItemPreview = styled.div`
  border: 0.5px solid rgba(0, 0, 0, 0.15);
`;

const FilterItemLabel = styled.div`
  margin-top: 6px;
  font-size: 11px;
  line-height: 12px;
`;

export {
  StyledFiltersWrapper,
  StyledFilterItem,
  FilterItemPreview,
  FilterItemLabel,
};