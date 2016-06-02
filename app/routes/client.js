import React from 'react'
import { Route } from 'react-router'

import App from '../components/App'

import Join from '../components/auth/Join'
import Login from '../components/auth/Login'
import SetPassword from '../components/auth/SetPassword'
import ResetPassword from '../components/auth/ResetPassword'

import AddProduct from '../components/product/Add'
import UpdateProduct from '../components/product/Update'
import ProductsTable from '../components/product/Table'
import ProductSearch from '../components/product/Search'

import AddCategory from '../components/category/Add'
import UpdateCategory from '../components/category/Update'
import CategoriesTable from '../components/category/Table'

import AddColor from '../components/color/Add'
import UpdateColor from '../components/color/Update'
import ColorsTable from '../components/color/Table'

import AddBrand from '../components/brand/Add'
import UpdateBrand from '../components/brand/Update'
import BrandsTable from '../components/brand/Table'

import AddSpaceType from '../components/spaceType/Add'
import UpdateSpaceType from '../components/spaceType/Update'
import SpaceTypesTable from '../components/spaceType/Table'

import SpaceDetail from '../components/space/Detail'
import SpacesIndex from '../components/space/Index'
import CreateSpace from '../components/space/Create'

const routes = (
  <Route component={App}>
    <Route path="join" component={Join}/>
    <Route path="login" component={Login}/>
    <Route path="reset-password" component={ResetPassword}/>
    <Route path="set-password/:code" component={SetPassword}/>

    <Route path="admin/products" component={ProductsTable}/>
    <Route path="products/add" component={AddProduct}/>
    <Route path="products/:id/update" component={UpdateProduct}/>
    <Route path="products/search" component={ProductSearch}/>

    <Route path="admin/categories" component={CategoriesTable}/>
    <Route path="admin/categories/add" component={AddCategory}/>
    <Route path="admin/categories/:id/update" component={UpdateCategory}/>

    <Route path="admin/colors" component={ColorsTable}/>
    <Route path="admin/colors/add" component={AddColor}/>
    <Route path="admin/colors/:id/update" component={UpdateColor}/>

    <Route path="admin/brands" component={BrandsTable}/>
    <Route path="admin/brands/add" component={AddBrand}/>
    <Route path="admin/brands/:id/update" component={UpdateBrand}/>

    <Route path="admin/space-types" component={SpaceTypesTable}/>
    <Route path="admin/space-types/add" component={AddSpaceType}/>
    <Route path="admin/space-types/:id/update" component={UpdateSpaceType}/>

    <Route path="spaces" component={SpacesIndex}/>
    <Route path="spaces/:sid/:name" component={SpaceDetail}/>
    <Route path="spaces/create" component={CreateSpace}/>
  </Route>
)

export default routes
